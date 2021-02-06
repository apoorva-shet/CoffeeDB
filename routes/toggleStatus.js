var express = require('express');
var db = require('../database');
var nodemailer = require('nodemailer');
var router = express.Router();

function sendEmail(email){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prince190803work@gmail.com',
      pass: 'Prince@99'
    }
  });
  
  var mailOptions = {
    from: 'prince190803work@gmail.com',
    to : email,
    subject: 'STATUS',
    text: 'Your order is prepared!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
}

router.post('/', async function (req, res, next) {

    const id = req.body.id;

    const query = {
      text: `
        UPDATE orders SET status = 1 where id = $1
        `,
      values: [id],
    };
    var response = await db.query(query);

    if(response){
        console.log(response);
        var email = req.user.email;
        sendEmail(email)
        res.send("Done");
    }
    else{
        res.send("Some Error Occured...")
    }
});
 

module.exports = router;