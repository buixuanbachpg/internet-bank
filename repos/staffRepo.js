var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');

exports.add = function(poco) {
    // poco={
    //     email: 'asad@',
    //     ten_tai_khoan: 'baach',
    //     mat_khau: '123',
    //     quyen_han: 1,
    //     dia_chi: 123546,
    //     so_dien_thoai: 10000
    //      }
    var md5_password = md5(poco.mat_khau);
    var sql = `insert into nhan_vien( ten_tai_khoan, mat_khau, quyen_han,dia_chi,email, so_dien_thoai) values('${poco.ten_tai_khoan}', '${md5_password}', ${poco.quyen_han}, '${poco.dia_chi}', '${poco.email}', ${poco.so_dien_thoai})`;
    return db.insert(sql);
}

exports.login = function(userName, password) {
    return new Promise((resolve, reject) => {
        var md5_password = md5(password);
        var sql = `select ten_tai_khoan,quyen_han from nhan_vien where ten_tai_khoan = '${userName}' and mat_khau = '${md5_password}'`;
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

exports.delete = function(id) {
    var sql = `DELETE FROM nhan_vien WHERE ten_tai_khoan =  '${id}'`;
    return db.delete(sql);
}

exports.load = function(id) {
    var sql = `select * from nhan_vien where ten_tai_khoan = '${id}'`;
    return db.load(sql);
}

exports.loadAll = function() {
    var sql = `select * from nhan_vien `;
    return db.load(sql);
}

exports.update = function(poco) {
    // poco={
    //     email: 'asad@',
    //     ten_tai_khoan: 'baach',
    //     mat_khau: '123',
    //     quyen_han: 1,
    //     dia_chi: 123546,
    //     so_dien_thoai: 10000
    //      }
    var md5_password = md5(poco.mat_khau);
    var sql = `update nhan_vien SET  mat_khau = '${md5_password}', quyen_han = ${poco.quyen_han},dia_chi = '${poco.dia_chi}',email = '${poco.email}', so_dien_thoai =${poco.so_dien_thoai} where ten_tai_khoan ='${poco.ten_tai_khoan}' `;
    return db.update(sql);
}