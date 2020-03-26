var express = require('express'),
    axios = require('axios');


var linkRepo = require('../repos/linkRepo');

var router = express.Router();



router.get('/', (req, res) => {
    linkRepo.encrypt().then( () => {
        res.json({
            msg: 'success'
        });
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});


module.exports = router;