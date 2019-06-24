const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  cors = require('cors'),
  morgan = require('morgan'),
  fs = require('fs'),
  https = require('https'),
  port = process.env.PORT || 3000;

// Raw Body For Stripe
const StripeWebhooks = {
  // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
  verify: function (req, res, buf) {
    var url = req.originalUrl;
    if (url.startsWith('/stripe/webhooks')) {
      req.rawBody = buf.toString();
    }
  }
};

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json(StripeWebhooks));

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route

//HTTPS on Port 443
https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app).listen(443);

//HTTP on Port 3000
app.listen(port);
console.log('API server started on: ' + port);