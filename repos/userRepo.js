var db = require('../fn/mysql-db'),
    bcrypt = require('bcrypt');
const saltRound = 10;
exports.loadDetail = function (id) {
    var sql = `select account_number,email,username,full_name,status from  khach_hang  where username = '${id}' or account_number='${id}'`;
    return db.load(sql);
}

exports.loadAccount = function (poco) {
    var sql = `select username, account_number, account_balance, full_name, email, phone, sex, address,status from khach_hang where username='${poco.username}' or account_number='${poco.account_number}' or email='${poco.email}'`;
    return db.load(sql);
}
exports.loadSaving = function (id) {
    var sql = `select * from tiet_kiem where account_number='${id}' `;
    return db.load(sql);
}
exports.loadAll = function () {
    var sql = `select * from khach_hang `;
    return db.load(sql);
}

exports.loadListRecipient = function (account_number) {
    var sql = `select * from danh_sach_nguoi_nhan where account_number = '${account_number}' `;
    return db.load(sql);
}

exports.addListRecipient = function (poco) {
    var sql = `insert into danh_sach_nguoi_nhan(account_number, account_number_receive, name_reminiscent) values('${poco.account_number}','${poco.account_number_receive}','${poco.name_reminiscent}')`;
    return db.insert(sql);
}
exports.deleteListRecipient = function (account_number, account_number_receive) {
    var sql = `DELETE FROM danh_sach_nguoi_nhan WHERE account_number_receive =  '${account_number_receive}' and account_number='${account_number}'`;
    return db.delete(sql);
}
exports.updateListRecipient = function (account_number, account_number_receive, name_reminiscent) {
    var sql = `update danh_sach_nguoi_nhan SET name_reminiscent='${name_reminiscent}' where account_number = '${account_number}'and account_number_receive = '${account_number_receive}' `;
    return db.update(sql);
}

exports.addInDebit = function (poco) {
    var sql = `insert into nhac_no(account_number, account_number_debit, message,amount) values('${poco.account_number}','${poco.account_number_debit}','${poco.message}','${poco.amount}')`;
    return db.insert(sql);
}
exports.deleteInDebit = function (account_number, account_number_debit) {
    var sql = `DELETE FROM nhac_no WHERE account_number_debit =  '${account_number_debit}' and account_number='${account_number}'`;
    return db.delete(sql);
}
exports.loadInDebit = function (account_number, opt) {
    if (1 == opt)
        var sql = `select * from nhac_no where account_number = '${account_number}' `;
    else
        var sql = `select * from nhac_no where account_number_debit = '${account_number}' `;

    return db.load(sql);
}

exports.addNotify = function (poco) {
    var sql = `insert into notify(username, message, user_send_notify) values('${poco.username}','${poco.message}','${poco.user_send_notify}')`;
    return db.insert(sql);
}
exports.deleteNotify = function (username) {
    var sql = `DELETE FROM notify WHERE username =  '${username}' `;
    return db.delete(sql);
}
exports.loadNotify = function (username) {
    var sql = `select * from notify where username = '${username}' `;
    return db.load(sql);
}
exports.updateNotify = async function (username) {
    // {
    //     "full_name":"bui xuan bach",
    //     "password":"12346789",
    //     "permission":1,
    //     "address":"277 nguyen van cu",
    //     "email":"test",
    //     "phone":"123456789"
    //     }
    var sql = `update notify SET  seen = '1' where username ='${username}' `;
    return db.update(sql);
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
    var sql = `update khach_hang SET  address = '${poco.address}',full_name = '${poco.full_name}', phone ='${poco.phone}',sex='${poco.sex}',status='${poco.status}' where username ='${poco.username}' `;
    return db.update(sql);
}

exports.updateAccountBalance = function (account_number, account_balance) {
    //     {

    // "to_account_number": "34325",
    //    "amount": 10000

    //    }
    var sql = `update khach_hang SET  account_balance = '${account_balance}' where account_number='${account_number}'`;
    return db.update(sql);
}
exports.updateDouAccountBalance = function (from_account_number, to_account_number, new_amount_from, new_amount_to) {
    var sql = `update khach_hang set account_balance = ( CASE WHEN account_number = '${from_account_number}' THEN '${new_amount_from}' WHEN account_number = '${to_account_number}' THEN '${new_amount_to}'  END) WHERE account_number IN ('${from_account_number}','${to_account_number}');`;
    return db.update(sql);
}
exports.login = async function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = `select * from khach_hang where username = '${username}'`;
        db.load(sql)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(null);
                } else {
                    var user = rows[0];
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result)
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
                            db.update(sql).then(changedRows => {
                                resolve(changedRows)
                            }).catch(err => reject(err));
                        } else
                            resolve(false);
                    });

                }
            })

    });
}

exports.getUserByAccNuber = async function (account_number) {
    var sql = `select * from khach_hang where account_number = '${account_number}'`;
    return db.load(sql);
}
exports.resetPassword = async function (poco) {
    bcryptPassword = await bcrypt.hash(poco.new_password, saltRound).then(hash => {
        return hash;
    }).catch(error => {
        console.log(error);
    });
    var sql = `update khach_hang SET password= '${bcryptPassword}'  where username ='${poco.username}' `;
    return db.update(sql);
}
exports.loadAccounts = function (id) {
    var sql = `select username, account_number, account_balance, full_name, email, phone, sex, address from khach_hang where username='${id}' or account_number='${id}' or email='${id}'`;
    return db.load(sql);
}



