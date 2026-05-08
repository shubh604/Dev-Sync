const nodeMailer = require("nodemailer");
require("dotenv").config();


function transporter(){

    // transporter setup
    return nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

}

module.exports = transporter();