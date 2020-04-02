var db = require('../fn/mysql-db');

exports.loadReceive = function(id) {
    var sql = `select account_number,email,username,full_name from doi_soat_noi_bo where account_number = '${id}'`;
    return db.load(sql);
}

exports.loadTransfer = function(id) {
    var sql = `select account_number,email,username,full_name from doi_soat_noi_bo where account_number = '${id}'`;
    return db.load(sql);
}
exports.loadPayDebit = function(id) {
    var sql = `select account_number,email,username,full_name from doi_soat_noi_bo where account_number = '${id}'`;
    return db.load(sql);
}
