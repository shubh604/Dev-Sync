const nodeMailer = require("nodemailer");
require("dotenv").config();


const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

transporter.verify((error, success) => {

    if(error){
        console.log("MAIL ERROR:", error);
    }
    else{
        console.log("MAIL SERVER READY");
    }

});

module.exports = transporter();