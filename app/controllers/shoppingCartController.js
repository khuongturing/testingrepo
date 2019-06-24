'use strict';

var Task = require('../models/appModel.js');
var Tools = require('../controllers/appController');
var Errors = require('../controllers/errorController');
const table = "shopping_cart";;

exports.generate_cart_id = function(req, res) {
    res.json({
        "cart_id": Tools.uniqueId()
      });
};

exports.add_product_to_cart = function(req, res) {
  //Define Default Values
  var procedureName = "shopping_cart_add_product";
  var cart_id = req.body.cart_id;
  var product_id = req.body.product_id;
  var attributes = req.body.attributes;

  if(!cart_id || !product_id || !attributes)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  }  
  else{
        //Calling Store Procedure
        var params = `"${cart_id}",${product_id},"${attributes}"`;
        Task.callProcedure(procedureName,params,function(err,task){
            if(!err)
            {
                params = `"${cart_id}"`;
                procedureName = "shopping_cart_get_products";
                Task.callProcedure(procedureName,params,function(err,task){
                    if(task[0])
                        res.json(task[0]);
                });
                
            }
            else{
                res.json({"error":{"message": "Product not added to cart"},"status":400},400);
            }
        });
    }
};

exports.get_products_list_in_cart = function(req, res) {
    var cart_id = req.params.cart_id;
    if(!cart_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `"${cart_id}"`;
    var procedureName = "shopping_cart_get_products";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task[0])
            res.json(task[0]);
        else
            res.json({"error":{"message": "Cart Not Available"},"status":400},400);
    });
};

exports.update_item_in_cart = function(req, res) {
  //Define Default Values
  var procedureName = "shopping_cart_update";
  var item_id = req.params.item_id;
  var quantity = req.body.quantity;

  if(!item_id || !quantity)
  {
      res.json(Errors.USR_10,Errors.USR_10.error.status);
  } 
  else if (isNaN(item_id) || isNaN(quantity))
  {
      res.json(Errors.USR_02,Errors.USR_02.error.status);
  } 
  else{
        //Calling Store Procedure
        var params = `${item_id},${quantity}`;
        Task.callProcedure(procedureName,params,function(err,task){
            if(task.affectedRows > 0)
            {
                res.json(Errors.SUCCESS);
                
            }
            else{
                res.json({"error":{"message": "Cart not updated / Item Not Found"},"status":400},400);
            }
        });
    }
};

exports.empty_cart = function(req, res) {
    var cart_id = req.params.cart_id;
    if(!cart_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `"${cart_id}"`;
    var procedureName = "shopping_cart_empty";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task.affectedRows > 0)
        {
            res.json(Errors.SUCCESS);
        }
        else
        {
            res.json({"error":{"message": "Cart Not Available"},"status":400},400);
        }     
    });
};

exports.move_product_to_cart = function(req, res) {
    var item_id = req.params.item_id;
    if(!item_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `${item_id}`;
    var procedureName = "shopping_cart_move_product_to_cart";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task.affectedRows > 0)
        {
            res.json(Errors.SUCCESS);
        }
        else
        {
            res.json({"error":{"message": "Item Not Available"},"status":400},400);
        }     
    });
};

exports.get_total_amount_from_cart = function(req, res) {
    var cart_id = req.params.cart_id;
    if(!cart_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `"${cart_id}"`;
    var procedureName = "shopping_cart_get_total_amount";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task[0][0].total_amount!=null)
        {
            res.json(task[0][0]);
        }
        else
        {
            res.json({"error":{"message": "Cart Not Available"},"status":400},400);
        }     
    });
};

exports.save_product_for_later = function(req, res) {
    var item_id = req.params.item_id;
    if(!item_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `${item_id}`;
    var procedureName = "shopping_cart_save_product_for_later";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task.affectedRows > 0)
        {
            res.json(Errors.SUCCESS);
        }
        else
        {
            res.json({"error":{"message": "Item Not Available"},"status":400},400);
        }     
    });
};

exports.get_saved_products_from_later = function(req, res) {
    var cart_id = req.params.cart_id;
    if(!cart_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `"${cart_id}"`;
    var procedureName = "shopping_cart_get_saved_products";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task[0][0])
        {
            res.json(task[0][0]);
        }
        else
        {
            res.json({"error":{"message": "Cart Not Available"},"status":400},400);
        }     
    });
};

exports.remove_product_from_cart = function(req, res) {
    var item_id = req.params.item_id;
    if(!item_id)
    {
        res.json(Errors.USR_10,Errors.USR_10.error.status);
    }
    var params = `${item_id}`;
    var procedureName = "shopping_cart_remove_product";
    Task.callProcedure(procedureName,params,function(err,task){
        if(task.affectedRows > 0)
        {
            res.json(Errors.SUCCESS);;
        }
        else
        {
            res.json({"error":{"message": "Cart Not Available"},"status":400},400);
        }     
    });
};