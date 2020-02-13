var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');

exports.add = function(poco) {
    poco={
        email: 'asad@',
        ten_tai_khoan: 'baach',
        mat_khau: '123',
        so_tai_khoan: 343225,
        tai_khoan_thanh_toan: 123546,
        so_du_thanh_toan: 10000
         }
    console.log(poco.mat_khau)
    var md5_password = md5(poco.mat_khau);
    var sql = `insert into tai_khoan(email, ten_tai_khoan, mat_khau, so_tai_khoan, tai_khoan_thanh_toan, so_du_thanh_toan) values('${poco.email}', '${poco.ten_tai_khoan}', '${md5_password}', '${poco.so_tai_khoan}', '${poco.tai_khoan_thanh_toan}', ${poco.so_du_thanh_toan})`;
    return db.insert(sql);
}

exports.login = function(userName, password) {
    return new Promise((resolve, reject) => {
        var md5_password = md5(password);
        var sql = `select * from users where f_Username = '${userName}' and f_Password = '${md5_password}'`;
        db.load(sql)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(null);
                } else {
                    var user = rows[0];
                    resolve(user);
                }
            })
            .catch(err => reject(err));
    });
}

exports.load = function(id) {
    var sql = `select * from users where f_ID = ${id}`;
    return db.load(sql);
}