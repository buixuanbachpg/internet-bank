const crypto = require('crypto');				
var openpgp = require('openpgp'),
 opts = require('../fn/opts');
var db = require('../fn/mysql-db');
openpgp.initWorker({ path:'openpgp.worker.js' })

   exports.signPGP=( async (privateKeyArmored, data) =>{
       try {
        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt("xuanbach");
    
        const { signature: detachedSignature } = await openpgp.sign({
            message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
            privateKeys: [privateKey],                            // for signing
            detached: true
        });
        return detachedSignature;
       }catch(error)
       {
        console.log(error);
        
       }       
        
    })

    exports.verifyPGP=( async(publicKeyArmored, detachedSignature, data) =>{
        try{
            const { signatures } = await openpgp.verify({
                message: openpgp.cleartext.fromText(data),              // CleartextMessage or Message object
                signature: await openpgp.signature.readArmored(detachedSignature), // parse detached signature
                publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
            });
            const { valid } = signatures[0];
            console.log("CHÚ Ý DÒNG NÀY "+ valid);
            return valid;
        }catch(error)
        {
            console.log(error);
        }
        
    })
    exports.hashMd5 = function(strToHash, secretKey) 
    {							
    const hmac = crypto.createHmac('md5', secretKey);							
    const content = hmac.update(strToHash);							
    const genHmac = content.digest('hex');							
    return genHmac;							
    }							
    							
    
exports.add = function(from_account_number,to_account_number,amount,message,timestamp,signature,partner_code) {
    var sql = `insert into doi_soat( from_account_number, to_account_number, amount,message,time,signature,partner_code) values('${from_account_number}',  '${to_account_number}', '${amount}', '${message}', '${timestamp}','${signature}','${partner_code}')`;
    return db.insert(sql);
}


exports.load = function(id) {
    var sql = `select * from chi_tiet_tai_khoan `;
    return db.load(sql);
}
exports.checkHash = function(partner_code,timestamp,account_number,hash,secretKey){
    let strToHash = `${partner_code}|${timestamp}|${account_number}`;
    let genHmac = this.hashMd5(strToHash, secretKey);
    if(genHmac === hash)
    return true;
    else
    return false;
}
exports.checkpartnercode =function(partner_code)
{
    if(partner_code=="tuananh")
       return secretKey="N9TT-9G0A-B7FQ-RANC";
    else if(partner_code=="vankhue")
        return secretKey="QK6A-JI6S-7ETR-0A6C";
    else
        return "";
}
exports.pgptoString =function(signature)
{
const words=signature.split('\n');
var text='';
for (word in words)
{
    text +=words[word];
}
return text;
}
// var account_number=123456789;
// var partner_code="vankhue";
// let timestamp = 1585248460999;
// var secretKey=this.checkpartnercode(partner_code);
// let strToHash = `${partner_code}|${timestamp}|${account_number}`;
// let genHmac = this.hashMd5(strToHash, secretKey);
// from_account_number =123456789;
// to_account_number=1234567891234;
// amount= 10000;
// messag="tro no 10000 vnd";
// let strToHash1 = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}`;
// let genHmac = 'b90fb5f48c366ef9800d6db07531650d';
// rs=  this.signPGP(opts.PGPKEY.privateKeyArmored,genHmac)

