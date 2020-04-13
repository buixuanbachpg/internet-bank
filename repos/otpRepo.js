
var db = require('../fn/mysql-db'),
    opts = require('../fn/opts');


exports.add =  function(email,otp) {
    let time=+new Date();
    var sql = `insert into otp(email, time, otp) values('${email}','${time}','${otp}')`;
    return db.insert(sql);
}
exports.load=function(email){
    var sql=`select * from otp where email= '${email}'`;
    return db.load(sql);
}
exports.update=function(email,otp)
{
    let time=+new Date();
    var sql = `update otp set otp ='${otp}',time='${time}' where email ='${email}'`;
    return db.update(sql);
}
exports.verifyOtpMail = (req, res, next) => {
    var otps = req.headers['x-access-otp'];
    if (otps) {        
            var sql = `select * from otp where email = '${req.body.email}' `;
            db.load(sql)
                .then(rows => {
                    if (rows.length === 0) {
                        res.status(401).json({
                            message:"otp verify failed"
                        })
                    } 
                    else if(rows[0].otp!=otps)
                    {
                        res.status(401).json({
                            message:"otp verify failed"
                        })
                    }
                    else{
                        next();
                    }
                      
                    
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message:"View log on console"
                    })
                });

    } else {
        res.statusCode = 403;
        res.json({
            msg: 'no otp mail found'
        });
    }
};