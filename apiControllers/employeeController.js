var express = require('express'),
    axios = require('axios'),
    opts = require('../fn/opts');
var userRepo = require('../repos/userRepo'),
employeeRepo = require('../repos/employeeRepo'),
    authRepo = require('../repos/authRepo');
var router = express.Router();

router.post('/', (req, res) => {
    employeeRepo.add(req.body)
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
    employeeRepo.updateAccountBalance(req.body)
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
    employeeRepo.updateSavingBalance(req.body)
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


router.get('/', (req, res) => {
    userRepo.loadAll().then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});


router.get('/account/:name', (req, res) => {
    
    if (req.params.name) {
        var id = req.params.name;

        userRepo.loadAccount(id).then(rows => {
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

router.get('/saving/:name', (req, res) => {
    
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
module.exports = router;