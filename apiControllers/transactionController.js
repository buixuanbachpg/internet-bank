var express = require('express'),
    opts = require('../fn/opts');
var tranRepo = require('../repos/transactionRepo'),
    userRepo = require('../repos/userRepo'),
    employeeRepo= require('../repos/employeeRepo');

var router = express.Router();

router.post('transactions/query_info', (req, res) => {
    const {partner_code, timestamp, hash} = req.query;
    const {account_number} =req.body;
    let currenttimestamp = +new Date();
   if(!partner_code || !timestamp || !hash || !account_number)
   {
       console.log("1");
       res.status(400).json({
           "statusCode": 400,
           "error": "Bad request",
           "message": "partner_code, timestamphash, account_number,hash is required"
       })
   }
   else if(tranRepo.checkpartnercode(partner_code)== ""){
    console.log("2");
    res.status(400).json({
        "statusCode": 400,
        "error": "Bad request",
        "message": "partner_code not registered"
    })
   }
   else if(currenttimestamp/1000-timestamp/1000>300)
   {
    console.log("3");
    res.status(400).json({
        "statusCode": 400,
        "error": "Bad request",
        "message": "timestamp is out of date"
    })
   }
   else if (tranRepo.checkHash(partner_code,timestamp,account_number,hash,tranRepo.checkpartnercode(partner_code)))
   {
    userRepo.loadDetail(account_number).then(rows => {
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json({
                "statusCode": 204,
                "message": "no data"
            })
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 400;
        res.end(' bad request ');
    });
   }
   else{
    res.status(400).json({
        "statusCode": 400,
        "message": " Wrong hash"
    })
   }
});


router.post('/transactions/receive_external', (req, res) => {
    const {partner_code, timestamp, hash, signature} = req.query;
    const {from_account_number,to_account_number,amount,message} =req.body;
    let currenttimestamp = +new Date();
   if(!partner_code || !timestamp || !signature || !from_account_number || !to_account_number || !amount || !message || !hash)
   {
       console.log("1");
       res.status(400).json({
           "statusCode": 400,
           "error": "Bad request",
           "message": "lack of information"
       })
   }
   else if(tranRepo.checkpartnercode(partner_code)== ""){
    console.log("2");
    res.status(400).json({
        "statusCode": 400,
        "error": "Bad request",
        "message": "partner_code not registered"
    })
   }
   else if(currenttimestamp/1000-timestamp/1000>300)
   {
    console.log("3");
    res.status(400).json({
        "statusCode": 400,
        "error": "Bad request",
        "message": "timestamp is out of date"
    })
   }
   else if (tranRepo.verifyPGP(opts.PGPKEY.publicKeyArmored,signature,hash))
   {
       signatures=tranRepo.pgptoString(signature);
       userRepo.loadAccount(to_account_number).then(rows=>
        {
            if(rows.length>0)
            {
                var user_old_amount=JSON.stringify(rows[0]);
                var user_json_amount=JSON.parse(user_old_amount);
                var new_amount=Number(user_json_amount.account_balance)+Number(amount);
                employeeRepo.updateAccountBalance(to_account_number,new_amount)
                .then(() => {
                    tranRepo.add(from_account_number,to_account_number,amount,message,timestamp,signatures,partner_code).then(rows => {
                        res.json({
                            msg: 'Your transaction success'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.statusCode = 400;
                        res.end(' bad request ');
                    });
                })
                
            }
           else{
            res.status(400).json({
                "message": "account_number not exist"
            })   
           }
        })
   }
   else{
    res.status(400).json({
        "statusCode": 400,
        "message": " verify PGP is failed "
    })
   }
});

router.post('/add', (req, res) => {
    const {partner_code, timestamp, hash, signature} = req.query;
    const {from_account_number,to_account_number,amount,message} =req.body;
    signatures= tranRepo.pgptoString(signature);
    console.log(signatures);
    tranRepo.add(from_account_number,to_account_number,amount,message,timestamp,signatures,partner_code)
        .then(rs => {
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
module.exports = router;