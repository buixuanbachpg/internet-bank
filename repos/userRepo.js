const bcrypt = require('bcrypt');
var db = require('../fn/mysql-db');
const saltRound=10;
function getRandomIntInclusive(Min,Max) {
    min = Math.ceil(Min);
    max = Math.floor(Max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
  async function getRandomAccountNumber(){
       var sql="",
        number="",
        Max=100000000000,
       Min=999999999999;
      while(1)
     {
        number= await getRandomIntInclusive(Min,Max);
        sql=`select account_number from khach_hang where account_number = '${number}'`;    
        result= await db.load(sql).then(rows => {
            if (rows.length > 0)
            return rows[0].account_number;
            else
            return "";
         });
         if(number != result)
         break ;
     }
     return number;
}
async function getRandomSavingAccountNumber(){
    var sql="",
     number="",
     Max=10000000000000,
    Min=99999999999999;
   while(1)
  {
     number= await getRandomIntInclusive(Min,Max);
     sql=`select saving_number from tiet_kiem where saving_number = '${number}'`;    
     result= await db.load(sql).then(rows => {
         if (rows.length > 0)
         return rows[0].saving_number;
         else
         return "";
      });
      if(number != result)
      break ;
  }
  return number;
}
exports.add = async function(poco) {
    // poco={
        // {
        //     "username": "asad@",
        //     "password": "baach",
        //     "account_balance": "123"
        //  }
    account_number= await getRandomAccountNumber();
    hash=await bcrypt.hash(poco.password, saltRound).then(hash=>{
return hash;
    }).catch(error=>{
        console.log(error);
    });
    var sql = `insert into khach_hang( username, password, account_number,account_balance) values('${poco.username}', '${hash}', '${account_number}','${poco.account_balance}')`;
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

exports.loadDetail = function(id) {
    var sql = `select account_number,email,username,full_name from chi_tiet_tai_khoan where account_number = '${id}'`;
    return db.load(sql);
}

exports.load = function(id) {
    var sql = `select * from khach_hang where username='${id}'`;
    return db.load(sql);
}
exports.loadAll = function() {
    var sql = `select * from khach_hang `;
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
