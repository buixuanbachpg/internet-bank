var db = require('../fn/mysql-db');

exports.loadReceiveLocal = function(id) {
    var sql = `select * from doi_soat_noi_bo where to_account_number = '${id}'`;
    return db.load(sql);
}

exports.loadTransferLocal = function(id) {
    var sql = `select * from doi_soat_noi_bo where from_account_number = '${id}'`;
    return db.load(sql);
}
exports.loadPayDebit = function(id) {
    var sql = `select from_account_number, to_account_number, amount, message, time, pay_debit where account_number = '${id}' and pay_debit='1'`;
    return db.load(sql);
}
exports.loadReceiveGlobal = function(id) {
    var sql = `select * from doi_soat where to_account_number = '${id}'`;
    return db.load(sql);
}

exports.loadTransferGlobal = function(id) {
    var sql = `select * from doi_soat where from_account_number = '${id}'`;
    return db.load(sql);
}