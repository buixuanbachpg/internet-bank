var express = require('express'),
    axios = require('axios'),
    opts = require('../fn/opts'),
    fs = require('fs');
var userRepo = require('../repos/userRepo'),
    authRepo = require('../repos/authRepo'),
    crosscheckRepo = require('../repos/crosscheckRepo'),
    transRepo = require('../repos/transactionRepo');
var router = express.Router();
var verifyOtpMail= require('../repos/otpRepo').verifyOtpMail;
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

            }
            else if (currentTime - rows[0].expiresIn > 1800) {
                res.statusCode = 403;
                res.json({
                    msg: 'refresh-token expired'
                });

                throw new Error('abort-chain'); // break promise chain

            }

            else {
                return rows[0].username;
            }
        })
        .then(id => userRepo.loadAccount(id))
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
router.put('/changePassword', (req, res) => {
    const { username, new_password, old_password } = req.body;
    userRepo.changePassword(username, new_password, old_password)
        .then(changedRows => {
            if(changedRows>0)
            {
                res.statusCode = 201;
                res.json({
                    changedRows: changedRows,
                    message:"thay đổi mật khẩu thành công"
                });
            }
            else if(false==changedRows){
                res.statusCode = 400;
            res.json({
                message:"Mật khẩu cũ không khớp"
            });
            }
            else{
                res.statusCode = 500;
            res.json({
                message:"Thay đổi không thành công"
            });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.post('/transfer/:bank',authRepo.verifyAccessToken,verifyOtpMail, async (req, res) => {
    var secret_key = "";
    var partner_code = "";
    var signature = "";
    bank = req.param.bank;
    let timestamp = +new Date();
    const { from_account_number, to_account_number, amount, message, pay_debit } = req.body;
    let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
    let genHmac = transRepo.hashMd5(strToHash, secret_key);
    if ("bkt.bank" === bank) {
        var url = `http://bkt-banking.herokuapp.com/api/transactions/receive_external`;
        partner_code = "bbd.bank";
        secret_key = "QK6A-JI6S-7ETR-0A6C";
        RSAprivateKeyArmored = fs.readFileSync('./fn/rsaPrivateKey.txt', 'utf8');
        signature = await transRepo.signRSA(RSAprivateKeyArmored, genHmac)
    }
    else if ("ta.bank" === bank) {
        var url = `https://ibserver.herokuapp.com/api/transactions/receive_external`;
        secret_key = "374e9e67-8838-400b-acb6-55a8428ae5fa";
        partner_code = "20929a37-5e69-44e2-94e4-c640bd4e33cd";
        PGPprivateKeyArmored = fs.readFileSync('./fn/0xC4BDB84C-sec.asc', 'utf8');
        signature = await transRepo.signPGP(PGPprivateKeyArmored, "p7gMVCAVStC9c3mMKhEuxspS21UfhCS8", genHmac);
    }
    else {
        res.status(400).json({
            message: "wrong bank name"
        });
    }
    userRepo.loadAccount(from_account_number).then(rows => {
        if (rows.length > 0) {
            users = rows[0];
            return users;
        }
        else {
            return null;
        }
    }).then(users => {
        if (users.account_balance > amount) {
            new_amount = Number(users.account_balance) - Number(amount);
            userRepo.updateAccountBalance(to_account_number, new_amount).then(changedRows => {
                if (1 == changedRows) {
                    axios({
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
                        res.json(response.data)
                    }).catch(function (error) {
                        console.log(error);
                        res.json(error.response.data)
                    });
                }
                else {
                    res.status(500).json({
                        message: "view log on console"
                    })
                }
            })
        }
    })



});

router.post('/transfer',authRepo.verifyAccessToken,verifyOtpMail, (req, res) => {
    let timestamp = +new Date();
    const { username, to_account_number, amount, message, pay_debit } = req.body;
    poco = {
        username: username,
        account_number: to_account_number
    }
    userRepo.loadAccount(poco).then(rows => {
        return rows;
    }).then(rows => {
        if (2==rows.length && null != rows[0] && null != rows[1]) {
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
                    }
                    else {
                        console.log("update fail");
                        res.status(500).json({
                            message: "view log on console"
                        })
                    }
                })
            }
            else {
                res.status(400).json({
                    message: "account balance not enough"
                })
            }
        }
        else {
            res.status(400).json({
                message: "account does not exist"
            })
        }

    })



});
router.post('/recipient ',authRepo.verifyAccessToken, (req, res) => {

    userRepo.add(req.body)
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

router.get('/history/receive/:id',authRepo.verifyAccessToken,async (req, res) => {
    
    if (req.params.id) {
        id=req.params.id;
        let local;
        try {
            local = await crosscheckRepo.loadReceiveLocal(id)  ;
        } catch (err) {
          logger.error(err);
          return res.status(500).send();
        }
      
        let global;
        try {
            global = await crosscheckRepo.loadReceiveGlobal(id);
        } catch (err) {
          logger.error( err);
          return res.status(500).send();
        }
        data={
            local:local,
            global:global
        }
        res.status(200).json(data);
        } 

        
    else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/history/transfer/:id',authRepo.verifyAccessToken,async (req, res) => {
    
    if (req.params.id) {
        id=req.params.id;
        let local;
        try {
            local = await crosscheckRepo.loadTransferLocal(id)  ;
        } catch (err) {
          logger.error(err);
          return res.status(500).send();
        }
      
        let global;
        try {
            global = await crosscheckRepo.loadTransferGlobal(id);
        } catch (err) {
          logger.error( err);
          return res.status(500).send();
        }
        data={
            local:local,
            global:global
        }
        res.status(200).json(data);
        } 

        
    else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/history/paydebit/:id',authRepo.verifyAccessToken,async (req, res) => {
    
    if (req.params.id) {
        id=req.params.id;
        crosscheckRepo.loadPayDebit(id).then(rows=>{
            res.json(rows);
        }).catch(err=>{
            console.log(err);
            res.status(500).send("view log on console");
        })
    }        
    else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/:name', authRepo.verifyAccessToken,(req, res) => {

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
router.post('/resetPassword',authRepo.verifyAccessToken,verifyOtpMail, (req,res)=>{
    userRepo.updatePassword(req.body).then(changedRows=>{
        if(changedRows){
            res.status(200).json({
                message:"changed success"
            })
        }
        else{
            res.status(500).json({
                message:"changed failed"
            })
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"view log on console"
        })
    })
});

router.post('/query_info/:bank/:id', (req, res) => {
    bank=req.params.bank;
    account_number=req.params.id;
    var secret_key="";
    var partner_code="";
    let timestamp = +new Date();
    if(bank && id)
    {
        if ("bkt.bank" === bank) {
            var url = `http://bkt-banking.herokuapp.com/api/transactions/query_info`;
             secret_key = "QK6A-JI6S-7ETR-0A6C";
              partner_code = "bbd.bank";
        }
        else if ("ta.bank" === bank) {
            var url = `https://ibserver.herokuapp.com/api/transactions/query_info`;
             secret_key = "374e9e67-8838-400b-acb6-55a8428ae5fa";
             partner_code = "20929a37-5e69-44e2-94e4-c640bd4e33cd";
        }  
    }   
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;   
    let genHmac = transRepo.hashMd5(strToHash, secret_key);
    let rs = axios({
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
        res.json(response.data)
    }).catch(function (error) {
        res.json(error.response.data)
    });
    console.log(rs);
});

router.get('/',authRepo.verifyAccessToken, (req, res) => {
    var poco ={
        email: req.query.email,
        username: req.query.username,
        account_number:req.query.account_number
     } ;
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

router.put('/', (req, res) => {
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