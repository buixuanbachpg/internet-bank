const bcrypt = require('bcrypt');
var db = require('../fn/mysql-db');
const saltRound=10;
exports.add =async function(poco) {
    // {
    //     "email": "test",
    //     "full_name": "bach",
    //     "password": "123"
    //     "permission": 1,
    //     "address": "123546",
    //     "phone": "10000",
    //     "sex":"nam"
    // }
    hash=await bcrypt.hash(poco.password, saltRound).then(hash=>{
        return hash;
            }).catch(error=>{
                console.log(error);
            });
    var sql = `insert into nhan_vien(full_name, password, permission, address, email, phone,sex) values('${poco.full_name}', '${hash}', ${poco.permission}, '${poco.address}', '${poco.email}', '${poco.phone}','${poco.sex}')`;
    return db.insert(sql);
}


exports.delete = function(id) {
    var sql = `DELETE FROM nhan_vien WHERE email =  '${id}'`;
    return db.delete(sql);
}



exports.update =async function(poco) {
    // {
    //     "full_name":"bui xuan bach",
    //     "password":"12346789",
    //     "permission":1,
    //     "address":"277 nguyen van cu",
    //     "email":"test",
    //     "phone":"123456789"
    //     }

    var bcrypt_password =await bcrypt.hash(poco.password, saltRound).then(hash=>{
        return hash;
            }).catch(error=>{
                console.log(error);
            });
    var sql = `update nhan_vien SET  password = '${bcrypt_password}', permission = ${poco.permission},address = '${poco.address}',full_name = '${poco.full_name}', phone =${poco.phone} where email ='${poco.email}' `;
    return db.update(sql);
}
exports.history=function(req)
{
const{fromDate,toDate,bank}=req.query;
var sql="";
if(""!=bank)
{
sql=`select * from doi_soat where time>=${fromDate} and time <=${toDate} and partner_code='${bank}' order by time desc`;
}
else{
    sql=`select * from doi_soat where time>=${fromDate} and time <=${toDate} order by time desc `;
}
return db.load(sql);
}