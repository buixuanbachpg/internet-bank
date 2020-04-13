var otpRepo = require('../repos/otpRepo');
const nodemailer = require("nodemailer");
var express = require('express'),
    opts = require('../fn/opts');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: opts.mail.user, // generated ethereal user
        pass: opts.mail.pass// generated ethereal password
    }
});

var router = express.Router();
router.post('/:email', (req, res) => {
    email = req.params.email;
    otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let mailOptions = {
        from: 'xuanbachpg@gmail.com',
        to: email,
        subject: 'OTP xác nhận chuyển tiền',
        text: 'Vui lòng nhập OTP: ' + otp + '. Để xác nhận là chuyển tiền'
    };
    otpRepo.load(email).then(rows=>{
        return rows;
    }).then(rows=>{
        if(0 === rows.length )
        {
            otpRepo.add(email, otp).then(insertId => {
                if (insertId) {
                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                message: "bad request"
                            });
                        }
                        return res.status(200).json({
                            message: "send mail success"
                        });
                    });
                }
                else {
                    console.log(err);
                    return res.status(500).json({
                        message: "view log on console"
                    });
                }
            }).catch(error=>{
                console.log(error);
                 res.status(500).json({
                    message: "view log on console"
                });
            })
        }
        else{
            otpRepo.update(email,otp).then(changedRows=>{
                if (changedRows) {
                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                message: "bad request"
                            });
                        }
                        return res.status(200).json({
                            message: "send mail success"
                        });
                    });
                }
                else {
                    console.log(err);
                    return res.status(500).json({
                        message: "view log on console"
                    });
                }
            }).catch(error=>{
                console.log(error);
                 res.status(500).json({
                    message: "view log on console"
                });
            })
        }
    })
   

});

module.exports = router;