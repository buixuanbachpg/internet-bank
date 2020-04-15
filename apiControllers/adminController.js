var express = require('express'),
    axios = require('axios');

var adminRepo = require('../repos/adminRepo'),
    employeeRepo = require('../repos/employeeRepo');

var router = express.Router();

router.post('/', (req, res) => {
    adminRepo.add(req.body)
        .then(insertId => {
            res.status(201).json({
                "message":"thêm thành công",
                "full_name":req.body.full_name,
                "permission":req.body.permission,
                "address": req.body.address,
                "email": req.body.email,
                "phone": req.body.phone
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});

router.put('/', (req, res) => {
    adminRepo.update(req.body)
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

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        var id = req.params.id;


        adminRepo.delete(id).then(affectedRows => {
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
router.get('/transaction', (req, res) => {
    adminRepo.history(req).then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});
router.get('/history', (req, res) => {
    adminRepo.history(req).then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});
router.get('/:name', (req, res) => {
    
    if (req.params.name) {
        console.log(req.params.name);
        var id = req.params.name;

        employeeRepo.load(id).then(rows => {
            if (rows.length > 0) {
                user=rows[0];
                res.json(
                    {
                        full_name: user.full_name,
                        permission:user.permission,
                        address: user.address,
                        email: user.email,
                        phone: user.phone,
                        sex: user.sex
                    }
                );
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
            msg: 'error',
            error: req.params.name
        });
    }
});
router.get('/', (req, res) => {
    employeeRepo.loadAll().then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console.');
    });
});




module.exports = router;