var express = require('express'),
    axios = require('axios'),
    opts = require('../fn/opts'),
    fs = require('fs');
var userRepo = require('../repos/userRepo'),
    authRepo = require('../repos/authRepo'),
    crosscheckRepo = require('../repos/crosscheckRepo'),
    transRepo = require('../repos/transactionRepo');
var router = express.Router();
var verifyOtpMail = require('../repos/otpRepo').verifyOtpMail;

router.post('/login', (req, res) => {
    userRepo.login(req.body.username, req.body.password)
        .then(userObj => {
            if (userObj) {
                var token = authRepo.generateAccessToken(userObj);
                var refreshToken = authRepo.generateRefreshToken();
                authRepo.updateUserRefreshToken(userObj.email, refreshToken)
                    .then(rs => {
                        res.json({
                            auth: true,
                            user: userObj,
                            access_token: token,
                            refresh_token: refreshToken
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.end('View error log on console.');
                    });
            } else {
                res.json({
                    auth: false
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});

router.post('/logout', authRepo.verifyAccessToken, (req, res) => {
    // var info = req.token_payload.info;
    var user = req.token_payload.user;
    authRepo.deleteUserRefreshToken(user.email)
        .then(affectedRows => {
            res.json({
                msg: 'success'
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});
router.post('/renew-token', (req, res) => {
    var rToken = req.body.refreshToken;
    currentTime = (+new Date() / 1000);
    authRepo.verifyUserRefreshToken(rToken)
        .then(rows => {
            console.log(rows);
            if (rows.length === 0) {
                res.statusCode = 400;
                res.json({
                    msg: 'invalid refresh-token'
                });

                throw new Error('abort-chain'); // break promise chain

            } else if (currentTime - rows[0].expiresIn > 1800) {
                res.statusCode = 403;
                res.json({
                    msg: 'refresh-token expired'
                });

                throw new Error('abort-chain'); // break promise chain

            } else {
                return rows[0].username;
            }
        })
        .then(id => userRepo.loadAccounts(id))
        .then(rows => {
            var userObj = rows[0];
            var token = authRepo.generateAccessToken(userObj);
            res.json({
                access_token: token
            });
        })
        .catch(err => {
            if (err.message !== 'abort-chain') {
                console.log(err);
                res.statusCode = 500;
                res.end('View error log on console.');
            }
        });
});
router.put('/changePassword',authRepo.verifyAccessToken, (req, res) => {
    const { username, new_password, old_password } = req.body;
    userRepo.changePassword(username, new_password, old_password)
        .then(changedRows => {
            if (changedRows > 0) {
                res.statusCode = 201;
                res.json({
                    changedRows: changedRows,
                    message: "change password success"
                });
            } else if (false == changedRows) {
                res.statusCode = 400;
                res.json({
                    message: "old password wrong"
                });
            } else {
                res.statusCode = 500;
                res.json({
                    message: "changed fail"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.post('/transfer/:bank', authRepo.verifyAccessToken, verifyOtpMail, async (req, res) => {
    var secret_key = "";
    var partner_code = "";
    var signature = "";
    var genHmac = "";
    bank = req.params.bank;
    let timestamp = +new Date();
    const { from_account_number, to_account_number, amount, message, } = req.body;
    if (!from_account_number || !to_account_number || !amount || !message) {
        console.log("1");
        res.status(400).json({
            "statusCode": 400,
            "error": "Bad request",
            "message": "lack of information"
        })
    }

    if ("bkt.bank" === bank) {
        var url = `http://bkt-banking.herokuapp.com/api/transactions/receive_external`;
        partner_code = "bbd.bank";
        secret_key = "QK6A-JI6S-7ETR-0A6C";
        RSAprivateKeyArmored = fs.readFileSync('./fn/rsaPrivateKey.txt', 'utf8');
        let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
        genHmac = transRepo.hashMd5(strToHash, secret_key);
        signature = await transRepo.signRSA(RSAprivateKeyArmored, genHmac)
    } else if ("ta.bank" === bank) {
        var url = `https://titi-bank-server.herokuapp.com/api/transactions/receive_external`;
        secret_key = "374e9e67-8838-400b-acb6-55a8428ae5fa";
        partner_code = "20929a37-5e69-44e2-94e4-c640bd4e33cd";
        PGPprivateKeyArmored = fs.readFileSync('./fn/0xC4BDB84C-sec.asc', 'utf8');
        let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
        genHmac = transRepo.hashMd5(strToHash, secret_key);
        signature = await transRepo.signPGP(PGPprivateKeyArmored, "p7gMVCAVStC9c3mMKhEuxspS21UfhCS8", genHmac);
    } else {
        res.status(400).json({
            message: "wrong bank name"
        });
    }
    let users = await userRepo.loadAccounts(from_account_number);
    if (!users) {
        res.status(500).json({
            message: "account not exist"
        })
    }
    new_amount = Number(users[0].account_balance) - Number(amount);
    let rs = await axios({
        url: url,
        method: 'POST',
        params: Object.assign({
            partner_code: partner_code,
            timestamp: timestamp,
            hash: genHmac,
            signature: signature
        }),
        data: {
            from_account_number: from_account_number,
            to_account_number: to_account_number,
            amount: amount,
            message: message
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
    if (rs.response) {
        res.status(400).json
            ({
                message: rs.response.data.message,
                error: rs.response.data.error
            })
    }
    else if (200 == rs.status) {
        userRepo.updateAccountBalance(from_account_number, new_amount).then(changedRows => {
            if (1 == changedRows) {
                transRepo.add(from_account_number, to_account_number, amount, message, timestamp, signatures, partner_code).then(insertId => {
                    res.json("transaction success");
                }).catch(err => {
                    console.log(err);
                    res.status(500).end("view log on console");
                })
            }
            else {
                res.status(500).end("fail to update balance account");
            }
        })
    }
    else {
        res.status(500).json
            ({
                message: "transaction fail"
            })
    }


});
router.post('/query_info', authRepo.verifyAccessToken, async (req, res) => {
    bank = req.body.bank;
    account_number = req.body.account_number;
    var secret_key = "";
    var partner_code = "";
    var url = "";
    let timestamp = +new Date();
    if (bank && account_number) {
        if ("bkt.bank" === bank) {
            url = `http://bkt-banking.herokuapp.com/api/transactions/query_info`;
            secret_key = "QK6A-JI6S-7ETR-0A6C";
            partner_code = "bbd.bank";
        }
        else if ("ta.bank" === bank) {
            url = `https://titi-bank-server.herokuapp.com/api/transactions/query_info`;
            secret_key = "374e9e67-8838-400b-acb6-55a8428ae5fa";
            partner_code = "20929a37-5e69-44e2-94e4-c640bd4e33cd";
        }
    }
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;
    let genHmac = transRepo.hashMd5(strToHash, secret_key);
    let rs = await axios({
        url: url,
        method: 'POST',
        params: Object.assign({
            partner_code: partner_code,
            timestamp: timestamp,
            hash: genHmac
        }),
        data: {
            account_number: account_number
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
    if (rs.response) {
        // res.status(400).json
        // ({
        //     message: rs.response.data.message,
        //     error:rs.response.data.error
        // })
        res.json(rs.response.data);
    }
    else if (200 == rs.status) {
        // res.status(200).json
        // ({
        //     email: rs.data.email,
        //     account_number :rs.data.error,
        //     username:rs.data.username,
        //     full_name:rs.response.data.full_name
        // })
        res.json(rs.data);
    }
    else {
        res.status(500).json
            ({
                message: "error don't know"
            })
    }
});


router.post('/transfer', authRepo.verifyAccessToken, verifyOtpMail, (req, res) => {
    let timestamp = +new Date();
    const {
        username, to_account_number, amount, message, pay_debit } = req.body;
    poco = {
        username: username,
        account_number: to_account_number
    }
    userRepo.loadAccount(poco).then(rows => {
        return rows;
    }).then(rows => {

        if (2 == rows.length && null != rows[0] && null != rows[1] && 1 == rows[0].status && 1 == rows[1].status) {

            var from_users = rows[0];
            var to_users = rows[1];

            if (from_users.username != username) {
                from_users = rows[1];
                to_users = rows[0];
            }

            if (Number(from_users.account_balance) > Number(amount)) {
                new_amount_from_users = Number(from_users.account_balance) - Number(amount);
                new_amount_to_users = Number(to_users.account_balance) + Number(amount);
                userRepo.updateDouAccountBalance(from_users.account_number, to_users.account_number, new_amount_from_users, new_amount_to_users).then(changedRows => {
                    if (2 == changedRows) {
                        transRepo.addLocal(from_users.account_number, to_users.account_number, amount, message, timestamp, pay_debit).then(insertId => {
                            res.status(200).json({
                                message: "chuyển thành công"
                            })
                        }).catch(error => {
                            console.log(error);
                            res.statusCode = 500;
                            res.end('View error log on console.');

                        })
                    } else {
                        console.log("update fail");
                        res.status(500).json({
                            message: "view log on console"
                        })
                    }
                })
            } else {
                res.status(400).json({
                    message: "account balance not enough"
                })
            }
        }
        else if ((2 == rows.length && null != rows[0] && null != rows[1]) || 0 == rows[0] || 0 == rows[1]) {
            res.status(400).json({
                message: "account is closed"
            })
        } else {

            res.status(400).json({
                message: "account is exist"
            })
        }

    })
});
router.post('/recipient', authRepo.verifyAccessToken, (req, res) => {

    userRepo.addListRecipient(req.body)
        .then(insertId => {
            res.status(201).json({
                "message": "thêm thành công",
                "insertId": insertId
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.put('/recipient', authRepo.verifyAccessToken, (req, res) => {
    const {
        account_number,
        account_number_receive,
        name_reminiscent
    } = req.body;
    userRepo.updateListRecipient(account_number, account_number_receive, name_reminiscent)
        .then(changedRows => {
            res.statusCode = 201;
            res.json({
                changedRows: changedRows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.post('/recipient/delete', authRepo.verifyAccessToken, (req, res) => {
    const {
        account_number,
        account_number_receive
    } = req.body;
    userRepo.deleteListRecipient(account_number, account_number_receive)
        .then(affectedRows => {
            res.json({
                affectedRows: affectedRows
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});

router.post('/indebit', authRepo.verifyAccessToken, (req, res) => {

    userRepo.addInDebit(req.body)
        .then(insertId => {
            res.status(201).json({
                "message": "insert success",
                "insertId": insertId
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.get('/indebit', authRepo.verifyAccessToken, (req, res) => {
    const {
        account_number,
        opt
    } = req.query;
    userRepo.loadInDebit(account_number, opt)
        .then(rows => {
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});
router.delete('/indebit', authRepo.verifyAccessToken, (req, res) => {
    const {
        account_number,
        account_number_debit
    } = req.query;
    userRepo.deleteInDebit(account_number, account_number_debit)
        .then(affectedRows => {
            res.json({
                affectedRows: affectedRows
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});

router.post('/notify', authRepo.verifyAccessToken, (req, res) => {

    userRepo.addNotify(req.body)
        .then(insertId => {
            res.status(201).json({
                "message": "insert success",
                "insertId": insertId
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.get('/notify/:username', authRepo.verifyAccessToken, (req, res) => {
  username=req.params.username;
    userRepo.loadNotify(username)
        .then(rows => {
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});
router.delete('/notify/:username', authRepo.verifyAccessToken, (req, res) => {
    username=req.params.username;

    userRepo.deleteNotify(username)
        .then(affectedRows => {
            res.json({
                affectedRows: affectedRows
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});
router.put('notify/:username', authRepo.verifyAccessToken, (req, res) => {
    username=req.params.username;
    userRepo.updateNotify(username)
        .then(changedRows => {
            res.statusCode = 201;
            res.json({
                changedRows: changedRows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.get('/history/receive/:id', authRepo.verifyAccessToken, async (req, res) => {

    if (req.params.id) {
        id = req.params.id;
        let local;
        try {
            local = await crosscheckRepo.loadReceiveLocal(id);
        } catch (err) {
            logger.error(err);
            return res.status(500).send();
        }

        let global;
        try {
            global = await crosscheckRepo.loadReceiveGlobal(id);
        } catch (err) {
            logger.error(err);
            return res.status(500).send();
        }
        data = {
            local: local,
            global: global
        }
        res.status(200).json(data);
    } else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/history/transfer/:id', authRepo.verifyAccessToken, async (req, res) => {

    if (req.params.id) {
        id = req.params.id;
        let local;
        try {
            local = await crosscheckRepo.loadTransferLocal(id);
        } catch (err) {
            logger.error(err);
            return res.status(500).send();
        }

        let global;
        try {
            global = await crosscheckRepo.loadTransferGlobal(id);
        } catch (err) {
            logger.error(err);
            return res.status(500).send();
        }
        data = {
            local: local,
            global: global
        }
        res.status(200).json(data);
    } else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/history/paydebit/:id', authRepo.verifyAccessToken, async (req, res) => {

    if (req.params.id) {
        id = req.params.id;
        crosscheckRepo.loadPayDebit(id).then(rows => {
            res.json(rows);
        }).catch(err => {
            console.log(err);
            res.status(500).send("view log on console");
        })
    } else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/:name', authRepo.verifyAccessToken, (req, res) => {

    if (req.params.name) {
        var id = req.params.name;

        userRepo.loadDetail(id).then(rows => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
    } else {
        res.statusCode = 400;
        res.json({
            msg: 'error'
        });
    }
});
router.post('/resetPassword', verifyOtpMail, (req, res) => {
    userRepo.resetPassword(req.body).then(changedRows => {
        if (changedRows) {
            res.status(200).json({
                message: "changed success"
            })
        } else {
            res.status(500).json({
                message: "changed failed"
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "view log on console"
        })
    })
});
router.get('/recipient/:account_number', authRepo.verifyAccessToken, (req, res) => {
    const account_number = req.params.account_number;
    userRepo.loadListRecipient(account_number)
        .then(rows => {
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});
router.get('/getbyacc/:account_number', authRepo.verifyAccessToken, (req, res) => {
    const account_number = req.params.account_number;
    userRepo.getUserByAccNuber(account_number)
        .then(rows => {
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});

router.get('/getbyusername/:username', (req, res) => {
    const username = req.params.username;
    userRepo.loadDetail(username)
        .then(rows => {
            if (rows) {
                res.json(rows);
            } else {
                res.statusCode = 204;
                res.end();
            }
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
});

router.get('/', authRepo.verifyAccessToken, (req, res) => {
    var poco = {
        email: req.query.email,
        username: req.query.username,
        account_number: req.query.account_number
    };
    userRepo.loadAccount(poco).then(rows => {
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.statusCode = 204;
            res.end();
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });

});

router.put('/', authRepo.verifyAccessToken, (req, res) => {
    userRepo.update(req.body)
        .then(changedRows => {
            res.statusCode = 201;
            res.json({
                changedRows: changedRows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});



module.exports = router;
