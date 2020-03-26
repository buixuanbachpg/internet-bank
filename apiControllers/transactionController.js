var express = require('express'),
    axios = require('axios');

var tranRepo = require('../repos/transactionRepo'),
    userRepo = require('../repos/userRepo');

var router = express.Router();

router.post('/query_info', (req, res) => {
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
   else if(tranRepo.checkpartnercode(partner_code)== null){
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
   else if (tranRepo.checktimestamp(partner_code,timestamp,account_number,hash,tranRepo.checkpartnercode(partner_code)))
   {
    userRepo.loadDetail(account_number).then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end(' error unknown ');
    });
   }
   else{
    res.status(204).json({
        "statusCode": 204,
        "message": " no data"
    })
   }
});


router.post('/receive_external', (req, res) => {
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
   else if(tranRepo.checkpartnercode(partner_code)== null){
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
   else if (tranRepo.verifyPGP(tranRepo.publicKeyArmored,signature,hash))
   {
    tranRepo.add(from_account_number,to_account_number,amount,message,timestamp,signature).then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end(' error unknown ');
    });
   }
   else{
    res.status(500).json({
        "statusCode": 500,
        "message": " Your transaction is failed"
    })
   }
});
module.exports = router;