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
async function hashPassword(password)
{
    await bcrypt.hash(password, saltRound).then(hash=>{
        return hash;
            }).catch(error=>{
                console.log(error);
            });
}
exports.add = async function(poco) {
    // poco={
        // {
        //     "username": "asad@",
        //     "password": "baach",
        //     "account_balance": "123"
        //  }
    account_number= await getRandomAccountNumber();
    hash=await hashPassword(poco.password);
    var sql = `insert into khach_hang( username, password, account_number,account_balance) values('${poco.username}', '${hash}', '${account_number}','${poco.account_balance}')`;
return db.insert(sql);
}

exports.updateAccountBalance = function(poco) {
    // poco={
        // username: 'asad@',
        // account_balance: 10000
    //      }
    var sql = `update khach_hang SET  account_balance = '${poco.account_balance}' where username='${poco.username}' or account_number='${poco.account_number}'`;
    return db.update(sql);
}
exports.updateSavingBalance = function(poco) {
    // poco={
        // username: 'asad@',
        // : 10000
    //      }
    var sql = `update tiet_kiem SET  saving_balance = '${poco.saving_balance}' where saving_number='${poco.saving_number}'`;
    return db.update(sql);
}

