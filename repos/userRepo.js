var db = require('../fn/mysql-db');

exports.loadDetail = function(id) {
    var sql = `select account_number,email,username,full_name from  khach_hang  where account_number = '${id}' or account_number='${id}'`;
    return db.load(sql);
}

exports.loadAccount = function(id) {
    var sql = `select * from khach_hang where username='${id}' or account_number='${id}' or email='${id}'`;
    return db.load(sql);
}
exports.loadSaving = function(id) {
    var sql = `select * from tiet_kiem where account_number='${id}' `;
    return db.load(sql);
}
exports.loadAll = function() {
    var sql = `select * from khach_hang `;
    return db.load(sql);
}
exports.loadReceive = function(id){
    var sql=`select * from doi_soat_noi_bo where to_account_number='${id}' order by time desc`;
    return db.load(sql);
}
exports.loadTransfer = function(id){
    var sql=`select * from doi_soat_noi_bo where from_account_number='${id}' order by time desc`;
    return db.load(sql);
}
exports.addListRecipient=function(poco){
    var sql = `insert into danh_sach_nguoi_nhan(account_number, account_number_receive, name_reminiscent) values('${poco.account_number}','${poco.account_number_receive}','${poco.name_reminiscent}')`;
    return db.insert(sql);
}