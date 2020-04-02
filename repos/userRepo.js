var db = require('../fn/mysql-db');

exports.loadDetail = function(id) {
    var sql = `select account_number,email,username,full_name from chi_tiet_tai_khoan where account_number = '${id}'`;
    return db.load(sql);
}

exports.loadAccount = function(id) {
    var sql = `select * from khach_hang where username='${id}' or account_number='${id}' `;
    return db.load(sql);
}
exports.loadSaving = function(id) {
    var sql = `select * from tiet_kiem where saving_number='${id}' `;
    return db.load(sql);
}
exports.loadAll = function() {
    var sql = `select * from khach_hang `;
    return db.load(sql);
}
exports.loadReceive = function(id){
    var sql=`select * from doi_soat_noi_bo where to_account_number='${id}'`;
    return db.load(sql);
}
exports.loadTransfer = function(id){
    var sql=`select * from doi_soat_noi_bo where from_account_number='${id}'`;
    return db.load(sql);
}