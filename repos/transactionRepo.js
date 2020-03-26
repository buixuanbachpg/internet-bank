const crypto = require('crypto');				
var openpgp = require('openpgp');

var db = require('../fn/mysql-db');
// openpgp.initWorker({ path:'openpgp.worker.js' })

var publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXmDaeQEEAJ0eapdlK/PV8Zzy7r9qFcroe61P3dwz8uMzqoWWdbZPmsr63bi+
Ri01SKyK1na0U+i9KX76ysWjyNKseUfWK1WZIuuVbc9SE9rPzv0VTj9lwWqzWwPP
7GVF2+0xvHDPYdSqRb8aAeRm7IU1DSqjGAS9CgrumZla4qnKJR3v/B1bABEBAAHN
J0J1aSBYdWFuIEJhY2ggPGJhb3BybzY2MjVAWWFob28uY29tLnZuPsKtBBMBCgAX
BQJeYNp5AhsvAwsJBwMVCggCHgECF4AACgkQ/lBn1wWl593/KgP/VO/NFHTXLOMz
kJfUy9iuevZu19AMpjUkCn9H8fXu3xn9EMYBNYorXLLS35hfFl7TH8QAN/JLdRVR
5431XtgdKXSCuh5ZIzWAtUPszrjVbSO4M+VY1srgu4JQbZJtKSxwvmeRM4fSOkM1
GsaGVrzh36ul+RWnt2ERsvWa8n6JS+vOjQReYNp5AQQAwIUtRXZVqqxtvjFQkczX
fjsweBUyiyo7VNviT9wsd3rFOdRPiM2CwEDetx4fUN83WrKpK6m1uoARauPe7vic
05WkDfOqx/hEZXJaU0sn1PpI/frVKNJr0bDo015yr8Ec3qjp5B0z8JgJdiyBa7+2
X0Njn4ki8GIK4uw63AdipEEAEQEAAcLAgwQYAQoADwUCXmDaeQUJDwmcAAIbLgCo
CRD+UGfXBaXn3Z0gBBkBCgAGBQJeYNp5AAoJEP98dWJcUvGuTDMD+gM7lUBcfBfZ
fhVReL4ZIV+dWukpjJGXFjq+aLgz8AUMKtHnkzS5zhSgCXc3XrGJN6LG4K1F7kYr
Nj0ZFqdvQzHHUNEcuDkpbl/X2+6aeuuKpj/Aw3kO/uC+ikJgsOez0ELKxs6m8Byq
1/8yKB44y0mgw0uSMolPvEpxpd3PAPzCHA8D/1mpouP+udu6NzYow50Vr5x6w8ZA
S1ITAaGfbxedcRDSTHhP/0y2ZBJMeSAFJeBGAb9wTy8zKMFdPIR/+RjTo30k8qG7
cdV9iMfVqSyndL0hFklRQMnM5OmcBhPzavwRV13D63lxSTB+3LfBAHSdJkXgl6Ck
cAEA+Kqm91N6BgMOzo0EXmDaeQEEAKFOBOELeMr7iLtsfHMwOsgTRiOwTOTSKG+K
gR5bm0mN3veg3doyufja+kZatc5jKU+YVs57uKlsb7EG2sz7zyGPOIBw9qAtYOdh
m9crxu4x2tuHXF9zN3EDz4iLW0C8BlHOOyA2XUpjB6vybtfF2eD+T/vwE6srGJGX
n/Y2YuH/ABEBAAHCwIMEGAEKAA8FAl5g2nkFCQ8JnAACGy4AqAkQ/lBn1wWl592d
IAQZAQoABgUCXmDaeQAKCRCZ6iGzNDzuASszA/0ZxgLY/SGMwru8EwojQr3TSOUu
lrHdaGs4i8QtkOdjbarA+VKib3Ptq0D5+PAqBTuZRexE4EAZgduTe3KsQDb+bVmg
o+m05KoaeUJFdY+qbVs4/kh3x+Jk3vktXysVZ2PBVpBq01vNFVqM5+eeMOmLqjeF
8uCcZgHLSGQ9haguJZvbA/43l0vWb14Z3vabZz/Nhp86g/4zGTdsstYpYhsJAxcQ
EV8lfXSfZ6LT4xTmgkyfT2qyl/h76GJgDmEqpMOwxewlwbmyjMQP59eEcnzEHyFl
jWakE8wV2fc6yLPUtSBD2XaWO54zhslkKf+K4yDB0h/tc3aIyuKGsNwABFmNFqeU
8A==
=qwTB
-----END PGP PUBLIC KEY BLOCK-----
`
const privateKeyArmored  = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=1ViA
-----END PGP PRIVATE KEY BLOCK-----
` 
const passphrase = "xuanbach"


   exports.signPGP=( async (privateKeyArmored, data) =>{
        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(passphrase);
    
        const { signature: detachedSignature } = await openpgp.sign({
            message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
            privateKeys: [privateKey],                            // for signing
            detached: true
        });
    console.log(detachedSignature);
        return detachedSignature;
    })

    exports.verifyPGP=( async(publicKeyArmored, detachedSignature, data) =>{
        const verified = await openpgp.verify({
            message: openpgp.cleartext.fromText('Hello, World!'),              // CleartextMessage or Message object
            signature: await openpgp.signature.readArmored(detachedSignature), // parse detached signature
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
        });
        const { valid } = verified.signatures[0];
        if (valid) {
            console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
        } else {
            throw new Error('signature could not be verified');
        }
    })
    
  



exports.hashMd5 = function(strToHash, secretKey) 
{							
    const hmac = crypto.createHmac('md5', secretKey);							
    const content = hmac.update(strToHash);							
    const genHmac = content.digest('hex');							
    return genHmac;							
}							
    							
    
exports.add = function(poco) {
    var sql = `insert into doi_soat( from_account_number, to_account_number, amount,message,time,sign) values('${poco.from_account_number}',  ${poco.to_account_number}, '${poco.amount}', '${poco.message}', ${poco.timestamp},${poco.sign})`;
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
        return null;
}

// var account_number=123456789;
var partner_code="vankhue";
let timestamp = 1585248460999;
var secretKey=this.checkpartnercode(partner_code);
// let strToHash = `${partner_code}|${timestamp}|${account_number}`;
// let genHmac = this.hashMd5(strToHash, secretKey);
// console.log(genHmac);
from_account_number =123456789;
to_account_number=1234567891234;
amount= 10000;
messag="tro no 10000 vnd"
let strToHash = `${partner_code}|${timestamp}|${from_account_number}|${to_account_number}|${amount}`;
let genHmac = 'b90fb5f48c366ef9800d6db07531650d';
var res=this.signPGP(privateKeyArmored,genHmac);
