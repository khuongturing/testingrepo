'use strict';

var Task = require('../models/appModel.js');
var Tools = require('../controllers/appController');
var Errors = require('../controllers/errorController');
// Set your secret key: remember to change this to your live secret key in production
const stripe = require('stripe')('sk_test_lomdOfxbm7QDgZWvR82UhV6D');
const endpointSecret = 'whsec_kGSIXlkVLL2BERSKbAz9TL6umTP83cc3';


// This method receive a front-end payment and create a charge.
exports.charge = function(req, res) {
    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    const order_id = req.body.order_id;
    const description = req.body.description;
    const amount = req.body.amount;
    var currency = req.body.currency;

    // Currency Validation
    if (!currency){
        currency = "usd";
    }
    // Validation
    if(!token || !order_id || !description || !amount)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }  
    else if (isNaN(order_id) || isNaN(amount)){
        res.json(Errors.USR_02, Errors.USR_02.error.status);
    }
    else{
        // Stripe Charge
        stripe.charges.create({
            amount: amount,
            currency: currency,
            description: description,
            source: token,
            metadata: {order_id: order_id},
        }, function(err, charge) {
            // asynchronously called
            if (err)
                res.json(err,err.statusCode);
            else
                res.json(charge);
        });
        
               
    }

};

//Endpoint that provide a synchronization
exports.webhooks = function(req, res) {
    const sig = req.headers['stripe-signature'];
    
    var event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    }
    catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        // Unexpected event type
        return res.status(400).end();
    }
  
    // Return a res to acknowledge receipt of the event
    res.json({received: true});
};