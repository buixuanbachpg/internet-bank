var express = require('express'),
    axios = require('axios'),
    opts = require('../fn/opts'),
     fs = require('fs');
var userRepo = require('../repos/userRepo'),
    authRepo = require('../repos/authRepo');
    transRepo=require('../repos/transactionRepo')
var router = express.Router();

router.post('/login', (req, res) => {
    employeeRepo.login(req.body.email, req.body.password)
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
    currentTime= (+new Date() /1000);
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
            else if (currentTime-rows[0].expiresIn>1800) {
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

router.post('/chuyentien3', async(req, res) => {
    var url = `https://ebanksv.herokuapp.com/api/transactions/receive_external`;
    const {from_account_number,to_account_number,amount,message} =req.body;
    var partner_code="tuananh";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
    let genHmac = transRepo.hashMd5(strToHash,transRepo.checkpartnercode(partner_code));
    let signature= await transRepo.signPGP1(opts.PGPKEY.privateKeyArmored,genHmac)
    axios({
            url: url,
            method: 'POST',
            params: Object.assign({
                partner_code: partner_code,
                timestamp: timestamp,
                hash: genHmac,
                signature: signature
            }),
            data:{        
                from_account_number :from_account_number,
                to_account_number:to_account_number,
                amount: amount,
                message:message
                    
            }
        }).then(function (response)
        {
            res.json(response.data)
        }).catch(function (error) {
            res.json(error.response.data)
          }); 
    
    
});
router.post('/chuyentien2', async(req, res) => {
    var url = `https://ibserver.herokuapp.com/api/transactions/receive_external`;
    const {from_account_number,to_account_number,amount,message} =req.body;
    var secret_key="374e9e67-8838-400b-acb6-55a8428ae5fa";
    let partner_code="20929a37-5e69-44e2-94e4-c640bd4e33cd";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
    let genHmac = transRepo.hashMd5(strToHash,secret_key);
    let signature= await transRepo.signPGP(genHmac);    
    try{
        let rs=await axios({
            url: url,
            method: 'POST',
            params: Object.assign({
                partner_code: partner_code,
                timestamp: timestamp,
                hash: genHmac,
                signature: signature
            }),
            data:{        
                from_account_number :from_account_number,
                to_account_number:to_account_number,
                amount: amount,
                message:message
                    
            }
        });
    console.log(rs);
    }   catch(error)
    {
        console.log(error);
        
    }
  
    res.send("done");

    
});

router.post('/recipient ', (req, res) => {
 
    userRepo.add(req.body)
        .then(insertId => {
            res.status(201).json({
                "message": "thêm thành công",
                "insertId":insertId
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
router.post('/Account/', (req, res) => {
    userRepo.updateAccountBalance(req.body)
        .then(results => {
            res.json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "bad request"
            })
        });
});

router.post('/Saving/', (req, res) => {
    userRepo.updateSavingBalance(req.body)
        .then(results => {
            res.status(200).json({
                "message": "nạp tiền thành công",
                "saving_number":req.body.saving_number,
                "saving_balance":req.body.saving_balance
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "message": "bad request"
            })
        });
});

router.get('/history/Receive/:id', (req, res) => {
    if (req.params.id) {
        var id = req.params.id;
        userRepo.loadReceive(id).then(rows => {
            res.json(rows);
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
router.get('/history/Transfer/:id', (req, res) => {
    if (req.params.id) {
        var id = req.params.id;
        userRepo.loadTransfer(id).then(rows => {
            res.json(rows);
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
router.delete('/:id', (req, res) => {
    if (req.params.id) {
        var id = req.params.id;


        staffRepo.delete(id).then(affectedRows => {
            res.json({
                affectedRows: affectedRows
            });
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

router.post('/login', (req, res) => {
    staffRepo.login(req.body.user, req.body.pwd)
        .then(userObj => {
            if (userObj) {                
                var token = authRepo.generateAccessToken(userObj);
                var refreshToken = authRepo.generateRefreshToken();
                authRepo.updateRefreshToken(userObj.ten_tai_khoan, refreshToken)
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

router.post('/renew-token', (req, res) => {
    var rToken = req.body.refreshToken;
    authRepo.verifyRefreshToken(rToken)
        .then(rows => {
            if (rows.length === 0) {
                res.statusCode = 400;
                res.json({
                    msg: 'invalid refresh-token'
                });

                throw new Error('abort-chain'); // break promise chain

            } else {
                return rows[0].ID;
            }
        })
        .then(id => staffRepo.load(id))
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
router.post('/logout', authRepo.verifyAccessToken, (req, res) => {
    // var info = req.token_payload.info;
    var user = req.token_payload.user;
    authRepo.deleteRefreshToken(user.ten_tai_khoan)
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

router.post('/chuyentien', async(req, res) => {
    var url = `http://bkt-banking.herokuapp.com/api/transactions/receive_external`;
    const {from_account_number,to_account_number,amount,message} =req.body;
    var partner_code="bbd.bank";
    RSAprivateKeyArmored=fs.readFileSync('./fn/rsaPrivateKey.txt', 'utf8');
    let timestamp = +new Date();
    let secret_key="QK6A-JI6S-7ETR-0A6C";
    let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
    let genHmac = transRepo.hashMd5(strToHash,secret_key);
    let signature= await transRepo.signRSA(RSAprivateKeyArmored,genHmac)
        let rs=await axios({
            url: url,
            method: 'POST',
            params: Object.assign({
                partner_code: partner_code,
                timestamp: timestamp,
                hash: genHmac,
                signature: signature
            }),
            data:{        
                from_account_number :from_account_number,
                to_account_number:to_account_number,
                amount: amount,
                message:message
                    
            }
        });
   console.log(rs);
   res.send("done");
   
  
    
});

router.post('/query_info', (req, res) => {
    var url = `http://bkt-banking.herokuapp.com/api/transactions/query_info`;
    const {account_number} =req.body;
    var partner_code="bbd.bank";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;
   let secret_key="QK6A-JI6S-7ETR-0A6C" ;
    let genHmac = transRepo.hashMd5(strToHash,secret_key);
    let rs= axios({
            url: url,
            method: 'POST',
            params: Object.assign({
                partner_code: partner_code,
                timestamp: timestamp,
                hash: genHmac
            }),
            data:{        
                account_number:account_number                    
            }
        }).then(function (response)
        {
            res.json(response.data)
        }).catch(function (error) {
            res.json(error.response.data)
          });
    console.log(rs);
});

router.post('/query_info2', async (req, res) => {
    var url = `https://ibserver.herokuapp.com/api/transactions/query_info`;
    const {account_number} =req.body;
    var secret_key="374e9e67-8838-400b-acb6-55a8428ae5fa";
    let partner_code="20929a37-5e69-44e2-94e4-c640bd4e33cd";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;
    let genHmac = transRepo.hashMd5(strToHash,secret_key);
    
    try{
        let rs= await axios({
            url: url,
            method: 'POST',
            params: Object.assign({
                partner_code: partner_code,
                timestamp: timestamp,
                hash: genHmac
            }),
            data:{        
                account_number:account_number                    
            }
        })
          console.log(rs);
    }catch(error)
    {
        console.log(error);
        
    }
});
router.get('/', authRepo.verifyAccessToken,(req, res) => {
    
        userRepo.loadAccount(req.body.username).then(rows => {
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


module.exports = router;