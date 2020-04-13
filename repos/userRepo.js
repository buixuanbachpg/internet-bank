var db = require('../fn/mysql-db'),
 bcrypt = require('bcrypt');
const saltRound=10;
exports.loadDetail = function(id) {
    var sql = `select account_number,email,username,full_name from  khach_hang  where account_number = '${id}' or account_number='${id}'`;
    return db.load(sql);
}

exports.loadAccount = function(poco) {
    var sql = `select username, account_number, account_balance, full_name, email, phone, sex, address from khach_hang where username='${poco.username}' or account_number='${poco.account_number}' or email='${poco.email}'`;
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


exports.addListRecipient=function(poco){
    var sql = `insert into danh_sach_nguoi_nhan(account_number, account_number_receive, name_reminiscent) values('${poco.account_number}','${poco.account_number_receive}','${poco.name_reminiscent}')`;
    return db.insert(sql);
}
exports.updateAccountBalance = function(account_number,account_balance) {
    //     {
        
            // "to_account_number": "34325",
        //    "amount": 10000
       
    //    }
        var sql = `update khach_hang SET  account_balance = '${account_balance}' where account_number='${account_number}'`;
        return db.update(sql);
}
exports.updateDouAccountBalance=function(from_account_number,to_account_number,new_amount_from,new_amount_to){
    var sql = `update khach_hang set account_balance = ( CASE WHEN account_number = '${from_account_number}' THEN '${new_amount_from}' WHEN account_number = '${to_account_number}' THEN '${new_amount_to}'  END) WHERE account_number IN ('${from_account_number}','${to_account_number}');`;
   return db.update(sql);
}
exports.login = async function(username,password) {
    return new Promise((resolve, reject) => {       
        var sql = `select * from khach_hang where username = '${username}'`;
        db.load(sql)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(null);
                } else {
                    var user = rows[0];
                    bcrypt.compare(password, user.password, function(err, result) {
                        if(result)
                        resolve(user);
                        else
                        resolve(null);
                    });
                    
                }
            })
            .catch(err => reject(err));
    });
}
exports.updatePassword= async function(poco)
{
    bcryptPassword=await bcrypt.hash(poco.password, saltRound).then(hash=>{
        return hash;
            }).catch(error=>{
                console.log(error);
            });
    var sql = `update khach_hang SET  password = '${bcryptPassword}' where username='${poco.username}'`;
    return db.update(sql);
}