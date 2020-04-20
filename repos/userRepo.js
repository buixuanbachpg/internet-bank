var db = require('../fn/mysql-db'),
 bcrypt = require('bcrypt');
const saltRound=10;
exports.loadDetail = function(id) {
    var sql = `select account_number,email,username,full_name from  khach_hang  where username = '${id}' or account_number='${id}'`;
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
exports.update = async function (poco) {
    // {
    //     "full_name":"bui xuan bach",
    //     "password":"12346789",
    //     "permission":1,
    //     "address":"277 nguyen van cu",
    //     "email":"test",
    //     "phone":"123456789"
    //     }
    var sql = `update khach_hang SET  address = '${poco.address}',full_name = '${poco.full_name}', phone ='${poco.phone}',sex='${poco.sex}' where username ='${poco.username}' `;
    return db.update(sql);
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
exports.changePassword = async function (username, new_password, old_password) {
    var bcrypt_password = await bcrypt.hash(new_password, saltRound).then(hash => {
        return hash;
    }).catch(error => {
        console.log(error);
    });
    return new Promise((resolve, reject) => {
        var sql = `select password from khach_hang where username = '${username}'`;        
        db.load(sql)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(null);
                } else {
                    var user = rows[0];
                    bcrypt.compare(old_password, user.password, function (err, result) {
                        if (result) {                          
                            var sql = `update khach_hang SET  password = '${bcrypt_password}' where username ='${username}' `;
                            db.update(sql).then(changedRows => { resolve(changedRows) }).catch(err => reject(err));
                        } else
                            resolve(false);
                    });

                }
            })

    });
}