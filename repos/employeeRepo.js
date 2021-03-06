const bcrypt = require('bcrypt');
var db = require('../fn/mysql-db');
const saltRound = 10;

function getRandomIntInclusive(Min, Max) {
    min = Math.ceil(Min);
    max = Math.floor(Max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
async function getRandomAccountNumber() {
    var sql = "",
        number = "",
        Max = 100000000000,
        Min = 999999999999;
    while (1) {
        number = await getRandomIntInclusive(Min, Max);
        sql = `select account_number from khach_hang where account_number = '${number}'`;
        result = await db.load(sql).then(rows => {
            if (rows.length > 0)
                return rows[0].account_number;
            else
                return "";
        });
        if (number != result)
            break;
    }
    return number;
}
async function getRandomSavingAccountNumber() {
    var sql = "",
        number = "",
        Max = 10000000000000,
        Min = 99999999999999;
    while (1) {
        number = await getRandomIntInclusive(Min, Max);
        sql = `select saving_number from tiet_kiem where saving_number = '${number}'`;
        result = await db.load(sql).then(rows => {
            if (rows.length > 0)
                return rows[0].saving_number;
            else
                return "";
        });
        if (number != result)
            break;
    }
    return number;
}

exports.add = async function (poco) {
    //    {
    //     "email": "asad@",
    //     "password": "baach",
    //     "account_balance": "123"
    //  }
    account_number = await getRandomAccountNumber();
    bcryptPassword = await bcrypt.hash(poco.password, saltRound).then(hash => {
        return hash;
    }).catch(error => {
        console.log(error);
    });
    var sql = `insert into khach_hang(username, password, account_number, account_balance, full_name, email, phone,sex,address) values('${poco.username}', '${bcryptPassword}', '${account_number}','${poco.account_balance}', '${poco.full_name}', '${poco.email}', '${poco.phone}', '${poco.sex}', '${poco.address}')`;
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

    var sql = `update nhan_vien SET  address = '${poco.address}',full_name = '${poco.full_name}', phone ='${poco.phone}',sex='${poco.sex}' where email ='${poco.email}' `;
    return db.update(sql);
}

exports.updateSavingBalance = function (poco) {
    // poco={
    // username: 'asad@',
    // : 10000
    //      }
    var sql = `update tiet_kiem SET  saving_balance = '${poco.saving_balance}' where saving_number='${poco.saving_number}'`;
    return db.update(sql);
}


exports.login = async function (email, password) {
    return new Promise((resolve, reject) => {
        var sql = `select * from nhan_vien where email = '${email}'`;
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
exports.load = function (id) {
    var sql = `select * from nhan_vien where email = '${id}'`;
    return db.load(sql);
}

exports.loadAll = function () {
    var sql = `select full_name, permission, address, email, phone, sex from nhan_vien `;
    return db.load(sql);
}
exports.changePassword = async function (email, new_password, old_password) {
    var bcrypt_password = await bcrypt.hash(new_password, saltRound).then(hash => {
        return hash;
    }).catch(error => {
        console.log(error);
    });
    return new Promise((resolve, reject) => {
        var sql = `select password from nhan_vien where email = '${email}'`;
        db.load(sql)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(null);
                } else {
                    var user = rows[0];
                    bcrypt.compare(old_password, user.password, function (err, result) {
                        if (result) {
                            var sql = `update nhan_vien SET  password = '${bcrypt_password}' where email ='${email}' `;
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
// bcrypt.compare("12346789", "$2b$10$ADicee.WuAA3sDkrApWuhOIG5FgGU7RPYcDps/B30Y44kVt87kZ9O", function (err, result) {
//     if (result) {                          
//         console.log("true");
//     } 
//     else{
//         console.log("s");
//     }
// })