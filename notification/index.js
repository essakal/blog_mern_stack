const express = require("express");
const app = express();
const amqp = require("amqplib");
app.use(express.json())

let connection, channel;
const queue1 = "notification_blog";
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'os1230238@gmail.com',
        pass: 'liuqjkloxjwkvupe'
    }
});


async function cnx() {
    const amqpserver = "amqp://guest:guest@rabbit:5672";
    connection = await amqp.connect(amqpserver);
    channel = await connection.createChannel();
    await channel.assertQueue(queue1);
}

cnx().then(() => {
    channel.consume(queue1, data => {
        newdata = JSON.parse(data.content)
        var mailOptions = {
            from: 'os1230238@gmail.com',
            to: newdata.email,
            subject: 'Sending Email from myblog',
            // text: "you have a new comment: " + newdata.cmt
            text: "you have a new comment: " + newdata.cmt
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log(user.email);
                console.log("bien sending email");
            }
        });
        // console.log(JSON.parse(data.content))
        channel.ack(data)
    })
})


app.listen(3000, () => {
    console.log("server2 working...")
})