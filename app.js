const express = require("express")
const path = require('path');
const bodyparser = require("body-parser")
const nodemailer = require("nodemailer")
require('dotenv').config();

const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/island.html")
})
app.get("/portfolio", (req, res)=> {
    res.sendFile(__dirname + "/portfolio.html")
})

app.post("/send_email", (req, res)=> {
    const email = req.body.email;
    const msg = req.body.msg;
    console.log(req.body);

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.PASSWORD // Your password
        }
    });

    let mailOptions = {
        from: email,
        to: 'aditinarkar2004@gmail.com', // List of recipients
        subject: 'Message from Portfolio Form', // Subject line
        text: `${msg}` // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Message sent: %s', info.messageId);
    });
    res.redirect("/")

})

app.listen(5000, ()=> {
    console.log("connected...");
})

