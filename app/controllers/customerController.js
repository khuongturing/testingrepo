'use strict';

var Task = require('../models/appModel.js');
var Tools = require('../controllers/appController');
var Errors = require('../controllers/errorController');
var fetch = require( 'node-fetch' );
const table = "customer";

exports.update_customer = function(req, res) {
  //Define Default Values
  var procedureName = "customer_update_account";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var day_phone = req.body.day_phone;
  var eve_phone = req.body.eve_phone;
  var mob_phone = req.body.mob_phone;
  
  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else{

    if(!name || !email)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    else if (!email.includes('@'))
    {
        res.json(Errors.USR_03,Errors.USR_03.error.status);
    }
    else if (!Tools.isPhoneNumber(day_phone) || !Tools.isPhoneNumber(eve_phone) || !Tools.isPhoneNumber(mob_phone))
    {
        res.json(Errors.USR_06,Errors.USR_06.error.status);
    }
    else{
      //Calling Store Procedure
      var params = `${customer_id},"${name}","${email}","${password}","${day_phone}","${eve_phone}","${mob_phone}"`;
      Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
          console.log(err);
          res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else
        {
            if(task[0])
            {
                res.json(task[0]);
            }
            else{
                res.json(Errors.SUCCESS);
            }
        }
      });
    }
  }
};

exports.get_customer_by_id = function(req, res) {
  //Define Default Values
  var procedureName = "customer_get_customer";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  
  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else{
        //Calling Store Procedure
        var params = `${customer_id}`;
        Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
            console.log(err);
            res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else
        {
            if(task[0][0])
            {
                res.json(task[0][0]);
            }
            else{
                res.json("");
            }
        }
        });
    }
};

exports.register_customer = function(req, res) {
  //Define Default Values
  var procedureName = "customer_add";
  var name = req.body.name ? req.body.name.trim():false;
  var email = req.body.email ? req.body.email.trim():false;
  var password = req.body.password ? req.body.password.trim():false;
  var obj = {};
  
  //Validation
  if(!name || !email || !password)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }
  else if (!email.includes('@'))
  {
      res.json(Errors.USR_03,Errors.USR_03.error.status);
  }
  else{

      //Calling Store Procedure
      var params = `"${name}","${email}","${password}"`;
      Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
            console.log(err);
            res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else if( task.code && task.code.includes("ER_DUP_ENTRY"))
        {
            res.json(Errors.USR_04,Errors.USR_04.error.status);
        }
        else
        {
            if(task[0][0]['LAST_INSERT_ID()'])
            {
                obj.customer = {};
                obj.customer.schema = {
                    "customer_id": task[0][0]['LAST_INSERT_ID()'],
                    "name": name,
                    "email": email,
                    "address_1": "",
                    "address_2": "",
                    "city": "",
                    "region": "",
                    "postal_code": "",
                    "country": "",
                    "shipping_region_id": 1,
                    "day_phone": "",
                    "eve_phone": "",
                    "mob_phone": "",
                    "credit_card": ""
                  };
                obj.accessToken = "Bearer "+ Tools.tokenGenerator(task[0][0]['LAST_INSERT_ID()']);
                obj.expires_in = "24h";
                res.json(obj);
            }
            else{
                res.json(Errors.USR_02,Errors.USR_02.error.status); 
            }
        }
      });
    
  }
};

exports.login_customer = function(req, res) {
  //Define Default Values
  var procedureName = "customer_get_login_info";
  var email = req.body.email ? req.body.email.trim():false;
  var password = req.body.password ? req.body.password.trim():false;
  var obj ={};

  if (email && !email.includes('@'))
  {
      res.json(Errors.USR_03,Errors.USR_03.error.status);
  } 
  else if(!email || !password)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }
  else{
    //Calling Store Procedure
    var params = `"${email}"`;
    Task.callProcedure(procedureName,params,function(err,task){
        if(!task[0][0])
        {
            res.json(Errors.USR_05,Errors.USR_05.error.status);
        }
        else{
            if(task[0][0].password && task[0][0].password == password)
            {
                Task.callProcedure("customer_get_customer",task[0][0].customer_id,function(err,task){
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        if(task[0][0])
                        {
                            delete task[0][0].password;
                            obj.customer = {};
                            obj.customer.schema = task[0][0];
                            obj.accessToken ="Bearer "+ Tools.tokenGenerator(task[0][0].customer_id);
                            obj.expires_in = "24h";
                            res.json(obj);
                        }
                        else{
                            res.json(Errors.USR_01,Errors.USR_01.error.status);
                        }
                    }
                });

            }
            else{
                res.json(Errors.USR_01,Errors.USR_01.error.status);
            }
        }
    });
  }
};

exports.login_customer_by_facebook = function(req, res) {
  var appToken = req.body.access_token;
  if(!appToken)
  {
    res.json(Errors.AUTH_01, Errors.AUTH_01.error.status);
    return;
  }
  //validate "social token"
  fetch( 'https://graph.facebook.com/me?access_token=' + appToken + '&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors', {method: 'GET',} )    
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    if(json.email)
    {
      //Account Validation    
      var obj = {};
      var email = json.email;
      var name = json.name;
      var procedureName = "customer_get_login_info";
      var params = `"${email}"`;
      Task.callProcedure(procedureName,params,function(err,task){
          if(!task[0][0])
          {
            // If Account not Exist, Register new account then return accessToken and Account Info
            params = `"${name}","${email}",""`;
            Task.callProcedure("customer_add",params,function(err,task){
              if(task[0][0]['LAST_INSERT_ID()'])
              {
                  obj.customer = {};
                  obj.customer.schema = {
                      "customer_id": task[0][0]['LAST_INSERT_ID()'],
                      "name": name,
                      "email": email,
                      "address_1": "",
                      "address_2": "",
                      "city": "",
                      "region": "",
                      "postal_code": "",
                      "country": "",
                      "shipping_region_id": 1,
                      "day_phone": "",
                      "eve_phone": "",
                      "mob_phone": "",
                      "credit_card": ""
                    };
                  obj.accessToken = "Bearer "+ Tools.tokenGenerator(task[0][0]['LAST_INSERT_ID()']);
                  obj.expires_in = "24h";
                  res.json(obj);
              }
              else{
                  res.json(Errors.AUTH_02, Errors.AUTH_02.error.status); 
              }
            });
          }
          else{
              // If Account Exist, Return accessToken and Account Info
              Task.callProcedure("customer_get_customer",task[0][0].customer_id,function(err,task){
                if(task[0][0])
                {
                    delete task[0][0].password;
                    obj.customer = {};
                    obj.customer.schema = task[0][0];
                    obj.accessToken ="Bearer "+ Tools.tokenGenerator(task[0][0].customer_id);
                    obj.expires_in = "24h";
                    res.json(obj);
                }
                else{
                    res.json(Errors.AUTH_02,Errors.AUTH_02.error.status);
                }

              });
          }
      });
    }
    else{
      res.json(Errors.AUTH_02,Errors.AUTH_02.error.status);
    }
  });
};

exports.update_customer_address = function(req, res) {
  //Define Default Values
  var procedureName = "customer_update_address";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var address_1 = req.body.address_1;
  var address_2 = req.body.address_2;
  var city = req.body.city;
  var region = req.body.region;
  var postal_code = req.body.postal_code;
  var country = req.body.country;
  var shipping_region_id = req.body.shipping_region_id;
  
  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else{

    if(!address_1 || !city || !region || !postal_code || !country || !shipping_region_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    else if (!isNaN(shipping_region_id)){
        res.json(Errors.USR_09,Errors.USR_09.error.status);
    }
    else{
      //Calling Store Procedure
      var params = `${customer_id},"${address_1}","${address_2}","${city}","${region}","${postal_code}","${country}",${shipping_region_id}`;
      Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
          console.log(err);
          res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else
        {
            if(task[0])
            {
                res.json(task[0]);
            }
            else{
                res.json(Errors.SUCCESS);
            }
        }
      });
    }
  }
};

exports.update_customer_credit_card = function(req, res) {
  //Define Default Values
  var procedureName = "customer_update_credit_card";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var credit_card = req.body.credit_card;
  
  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else{

    if(!credit_card)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    else if(!Tools.isCardValid(credit_card))
    {
        res.json(Errors.USR_08,Errors.USR_08.error.status);
    }
    else{
      //Calling Store Procedure
      var params = `${customer_id},"${credit_card}"`;
      Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
          console.log(err);
          res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else
        {
            if(task[0])
            {
                res.json(task[0]);
            }
            else{
                res.json(Errors.SUCCESS);
            }
        }
      });
    }
  }
};
