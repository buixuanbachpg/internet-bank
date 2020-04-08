var randtoken = require('rand-token'),
    jwt = require('jsonwebtoken'),
    moment = require('moment');

var db = require('../fn/mysql-db'),
    opts = require('../fn/opts');

//
// acccess-token

exports.generateAccessToken = userObj => {
    var payload = {
        user: userObj,
        info: 'more info for you'
    }
    var token = jwt.sign(payload, opts.ACCESS_TOKEN.SECRET_KEY, {
        expiresIn: opts.ACCESS_TOKEN.LIFETIME
    });

    return token;
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, opts.ACCESS_TOKEN.SECRET_KEY, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'verify failed',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'no token found'
        });
    }
};

//
// refresh-token

exports.generateRefreshToken = () => {
    return randtoken.generate(opts.REFRESH_TOKEN.SIZE);
}

exports.updateUserRefreshToken = (id, refreshToken) => {
    return new Promise((resolve, reject) => {
        var rdt=(+new Date() /1000) ;
        var sql = `delete from userrefreshtokenext where username = '${id}'`;
        db.delete(sql)
            .then(affectedRows => {
                sql = `insert into userrefreshtokenext values('${id}', '${refreshToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(insert_id => {
                resolve(true);
            })
            .catch(err => reject(err));
    });
}

exports.verifyUserRefreshToken = refreshToken => {
    var sql = `select * from userrefreshtokenext where refreshToken = '${refreshToken}'`;
    return db.load(sql);
}

exports.deleteUserRefreshToken = id => {
    var sql = `delete from userrefreshtokenext where username = '${id}'`;
    return db.delete(sql);
}

exports.updateEmployeeRefreshToken = (id, refreshToken) => {
    return new Promise((resolve, reject) => {
        var rdt=Number(+new Date() /1000) ;
        var sql = `delete from employeef5token where email = '${id}'`;
        db.delete(sql)
            .then(affectedRows => {
                sql = `insert into employeef5token values('${id}', '${refreshToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(insert_id => {
                resolve(true);
            })
            .catch(err => reject(err));
    });
}

exports.verifyEmployeeRefreshToken = refreshToken => {
    var sql = `select * from employeef5token where refreshToken = '${refreshToken}'`;
    return db.load(sql);
}

exports.deleteEmployeeRefreshToken = id => {
    var sql = `delete from employeef5token where email = '${id}'`;
    return db.delete(sql);
}
