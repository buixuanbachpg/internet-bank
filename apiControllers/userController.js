var express = require('express'),
    axios = require('axios');

var userRepo = require('../repos/userRepo');

var router = express.Router();
router.post('/', (req, res) => {
    userRepo.add(req.body)
        .then(insertId => {
            res.statusCode = 201;
            res.json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});
module.exports = router;