var express = require('express'),
    axios = require('axios'),
    opts = require('../fn/opts');
var userRepo = require('../repos/userRepo'),
    authRepo = require('../repos/authRepo');
    transRepo=require('../repos/transactionRepo')
var router = express.Router();

router.post('/', (req, res) => {
    userRepo.add(req.body)
        .then(insertId => {
            res.statusCode = 201;
            res.json(insertId);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});

router.post('/update', (req, res) => {
    staffRepo.update(req.body)
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

router.get('/', (req, res) => {
    userRepo.loadAll().then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
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

router.get('/:name', (req, res) => {
    
    if (req.params.name) {
        var id = req.params.name;

        userRepo.load(id).then(rows => {
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
    var url = `http://localhost:3000/trans/receive_external`;
    const {from_account_number,to_account_number,amount,message} =req.body;
    var partner_code="vankhue";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}|${message}`;
    let genHmac = transRepo.hashMd5(strToHash,transRepo.checkpartnercode(partner_code));
    let signature= await transRepo.signPGP(opts.PGPKEY.privateKeyArmored,genHmac)
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
router.post('/query_info', (req, res) => {
    var url = `http://localhost:3000/trans/query_info`;
    const {account_number} =req.body;
    var partner_code="vankhue";
    let timestamp = +new Date();
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;
    let genHmac = transRepo.hashMd5(strToHash,transRepo.checkpartnercode(partner_code));
     axios({
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
    
});
module.exports = router;