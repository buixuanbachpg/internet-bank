var express = require('express');
var userRepo = require('../repos/userRepo'),
employeeRepo = require('../repos/employeeRepo'),
tranRepo = require('../repos/transactionRepo'),
crosscheckRepo = require('../repos/crosscheckRepo'),
authRepo = require('../repos/authRepo');
    var router = express.Router();
router.post('/login', (req, res) => {
        employeeRepo.login(req.body.email, req.body.password)
            .then(userObj => {
                if (userObj) {
                    var token = authRepo.generateAccessToken(userObj);
                    var refreshToken = authRepo.generateRefreshToken();
                    authRepo.updateEmployeeRefreshToken(userObj.email, refreshToken)
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
        authRepo.deleteEmployeeRefreshToken(user.email)
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
        authRepo.verifyEmployeeRefreshToken(rToken)
            .then(rows => {
                console.log(rows[0].expiresIn);
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
            .then(id => employeeRepo.load(id))
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
router.post('/Account/',authRepo.verifyAccessToken,  (req, res) => {
    const {to_account_number,amount,message}=req.body;
    poco={
        account_number:to_account_number
    }
    if(!to_account_number || !amount || !message)
    {
        res.status(400).json({
            "statusCode": 400,
            "error": "Bad request",
            "message": "account_number,amount,message required"
        })
    }
    else{
        userRepo.loadAccount(poco).then(rows=>
            {
                if(rows.length>0)
                {
                    var user_old_amount=JSON.stringify(rows[0]);
                    var user_json_amount=JSON.parse(user_old_amount);
                    var new_amount=Number(user_json_amount.account_balance)+Number(amount);
                    userRepo.updateAccountBalance(to_account_number,new_amount)
                    .then(() => {
                        let time=+new Date();
                        tranRepo.addLocal("0000",to_account_number,amount,message,time,false).then(()=>{
                            res.status(200).json({
                                "account_number":to_account_number,
                                "amount":"+"+amount,
                                "message": "sucessful"
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                "message": "bad request"
                            })
                        });
                    })
                    
                }
               else{
                res.status(400).json({
                    "message": "account_number not exist"
                })   
               }
            }); 
    }
});

router.post('/Saving/',authRepo.verifyAccessToken,  (req, res) => {
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

router.get('/:name',authRepo.verifyAccessToken, (req, res) => {
    
    if (req.params.name) {
        var poco ={
           email: req.params.name,
           username: req.params.name,
           account_number:req.params.name
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
    } else {
        res.statusCode = 400;
        res.json({
            msg: 'error'
        });
    }
});
router.get('/history/receive/:id',(req, res) => {
    
    if (req.params.id) {
        crosscheckRepo.loadReceiveLocal(req.params.id).then(rows => {
          return rows;
        }).then(rows=>{
            console.log(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console.');
        });
        } 

        
    else {
        res.statusCode = 400;
        res.json({
            msg: 'number_acccount not found'
        });
    }
});
router.get('/',authRepo.verifyAccessToken,  (req, res) => {
    userRepo.loadAll().then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});



router.get('/saving/:name',authRepo.verifyAccessToken,  (req, res) => {
    
    if (req.params.name) {
        var id = req.params.name;

        userRepo.loadSaving(id).then(rows => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(204).json({
                    msg: 'no data'
                });
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
router.post('/',authRepo.verifyAccessToken,  (req, res) => {
    employeeRepo.add(req.body)
        .then(insertId => {
            res.status(201).json({
                "message": "thêm thành công",
                "username":req.body.username,
                "account_balance": req.body.account_balance
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
module.exports = router;