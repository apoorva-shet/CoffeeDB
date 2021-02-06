var express = require('express');
var db = require('../database');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log("before")
  if (!req.session.visits) {
    req.session.visits = 1;
  } else {
    req.session.visits += 1;
  }
  
  const username = req.user ? req.user.username : '';
  const  role = req.user ? req.user.role : '';
  var isAdmin = false;

  if(role === 'Admin'){
    isAdmin = true;

    const query={
      text:`
      SELECT id,username,latte,mocha,expresso,blackcoffee FROM orders WHERE status=0
      ORDER BY ordertime ASC
      `,
    };
    
    var response= await db.query(query);

    console.log(response.rows);
  
    res.render('index', {
      visits: req.session.visits,
      loggedIn: req.user,
      username,
      isAdmin,
      data:response.rows,
    });
  }
  else{
    res.render('index', {
      visits: req.session.visits,
      loggedIn: req.user,
      username,
    });
  }
});

router.post('/', async function (req, res, next) {

     const username = req.user ? req.user.username : '';
     console.log(req.body);

     var latte = parseInt(req.body.latteCount);
     var mocha = parseInt(req.body.mochaCount);
     var blackcoffee = parseInt(req.body.blackCount);
     var expresso = parseInt(req.body.expressoCount);
     var address = "Junk value";
     var status = 0;
     const query = {
       text: `
    INSERT INTO orders(username, latte, mocha, expresso, blackcoffee, address,status)
    VALUES($1, $2, $3, $4, $5, $6,$7)
    RETURNING id
    `,
       values: [username, latte, mocha, blackcoffee, expresso, address,status],
     };
     var response = await db.query(query);
     if (response) {
       console.log(response.rows[0].id);
     }
     var id = response.rows[0].id;
    var url = 'http://localhost:3000/payment/'+id;
    return res.redirect(url)

});

var Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: 'rzp_test_Yk14knpeAmG7pi',
  key_secret: 'HVZyrkN4p9vod3fRFvahK6NB'
})


router.get('/payment/:id',async function (req,res,next){
  if(req.user){
    var id  = req.params.id
    const query={
      text:`SELECT username,latte,mocha,expresso,blackcoffee FROM orders WHERE id=$1`,
      values:[id],
    };

    var pay=await db.query(query);
    console.log(pay.rows[0])

    var latteCount = pay.rows[0].latte;
    var expressoCount = pay.rows[0].expresso;
    var blackcoffeeCount = pay.rows[0].blackcoffee;
    var mochaCount = pay.rows[0].mocha;

    var amount = 10*(latteCount + expressoCount + blackcoffeeCount + mochaCount)*100;
    var username = req.user ? req.user.username : "";

    var currency='INR'
    var receipt = '1234545f4'
    var payment_capture = false
    var notes = req.user.username
    var order_id;

    instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
      console.log("**********Order Created***********");
      console.log(response);
      console.log("**********Order Created***********");
      order_id=response.id;
      
      }).catch((error) => {
        console.log(error);
      })

      var actualAmount = amount/100
    res.render('payment', {
      visits: req.session.visits,
      loggedIn: req.user,
      username,
      id:id,
      latte : latteCount,
      mocha : mochaCount,
      expresso : expressoCount,
      blackcoffee : blackcoffeeCount,
      toPay : amount,
      order_id : order_id,
      email:req.user.email,
      actualAmount : actualAmount,
    });
  }
  
});

router.post('/payment/purchase', (req,res) =>{
  payment_id =  req.body;
  console.log("**********Payment authorized***********");
  console.log(payment_id);
  console.log("**********Payment authorized***********");
  instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
  console.log("**********Payment instance***********");
  console.log(response); 
  console.log("**********Payment instance***********")
  instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
  res.send(response);
}).catch((error) => {
console.log(error);
});


}).catch((error) => {
console.log(error);
});

})


module.exports = router;
