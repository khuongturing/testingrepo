'use strict';

var Task = require('../models/appModel.js');
var Tools = require('../controllers/appController');
var Errors = require('../controllers/errorController');
const table = "orders";;

exports.create_order = function(req, res) {
  //Define Default Values
  var procedureName = "shopping_cart_create_order";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var cart_id = req.body.cart_id;
  var shipping_id = req.body.shipping_id;
  var tax_id = req.body.tax_id;

  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else if(!cart_id || !shipping_id || !tax_id)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }  
  else{
        //Calling Store Procedure
        var params = `"${cart_id}",${customer_id},${shipping_id},${tax_id}`;
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
                res.json({"error":{"message": "Order not created"},"status":400},400);
            }
        }
        });
    }
};

exports.get_order_info = function(req, res) {
  //Define Default Values
  var procedureName = "orders_get_order_details";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var order_id = req.params.order_id;

  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else if(!order_id)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }  
  else if(isNaN(order_id))
  {
      res.json(Errors.USR_02,Errors.USR_02.error.status);
  } 
  else{
        //Calling Store Procedure
        var params = `${order_id}`;
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
                res.json({"error":{"message": "Order not found."},"status":404},404);
            }
        }
        });
    }
};

exports.get_orders_by_customer = function(req, res) {
  //Define Default Values
  var procedureName = "orders_get_by_customer_id";
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
        if(task[0][0])
        {
            res.json(task[0][0]);
        }
        else{
            res.json({"error":{"message": "No Orders available for this Customer"},"status":404},404);
        }
        });
    }
};

exports.get_order_short_info = function(req, res) {
  //Define Default Values
  var procedureName = "orders_get_order_short_details";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var order_id = req.params.order_id;

  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else if(!order_id)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }  
  else if(isNaN(order_id))
  {
      res.json(Errors.USR_02,Errors.USR_02.error.status);
  } 
  else{
        //Calling Store Procedure
        var params = `${order_id}`;
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
                res.json({"error":{"message": "Order not found."},"status":404},404);
            }
        }
        });
    }
};
