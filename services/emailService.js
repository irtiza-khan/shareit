const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


function sendMail({ from, to, subject, text, html }) {

    try {
        let transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
                clienId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN

            }

        });

        let mailData = transport.sendMail({
            from: `inShare<${from}>`,
            to,
            subject,
            text,
            html

        }, (err, info) => {
            if (err) {
                console.log('Error Sending Mail');
            } else {
                console.log('Message Sent Successfully');


                console.log(info);
            }
        })


    } catch (err) {
        console.log(err);

    }




}


module.exports = sendMail;