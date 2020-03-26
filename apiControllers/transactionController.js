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
    res.status(200).json({
        "statusCode": 200,
        "message": " no data"
    })
   }
});



module.exports = router;