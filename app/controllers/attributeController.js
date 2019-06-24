'use strict';

var Task = require('../models/appModel.js');
var Errors = require('../controllers/errorController');
const table = "attribute";

exports.list_all_attributes = function(req, res) {
  Task.getAll(table,function(err, task) {
    if (err)
      console.log(err);
    res.json(task);
  });
};

exports.get_attribute_by_id = function(req, res) {
  var id = req.params.attribute_id;
  var column = "attribute_id";
  var error = {};

  Task.getById(table,id,column, function(err, task) {
    if (err)
      console.log(err);
    if(task.length != 0)
    {
      res.json(task[0]);
    }
    else
    {
      res.json(Errors.ATT_01, Errors.ATT_01.error.status);
    }
  });
};

exports.get_attribute_value_by_id = function(req, res) {
    var id = req.params.attribute_id;
    var column = "attribute_id";
    var error = {};
  
    Task.getById("attribute_value",id,column, function(err, task) {
      if (err)
        console.log(err);
      if(task.length != 0)
      {
        task.forEach(element => {
            delete element["attribute_id"];
        });
        res.json(task);
      }
      else
      {
        res.json(Errors.ATT_01, Errors.ATT_01.error.status);
      }
    });
};

exports.get_attribute_by_productid = function(req, res) {
    var id = req.params.product_id;
    var column = "product_id";
  
    Task.getById("product_attribute",id,column, function(err, task) {
        if (err)
            console.log(err);
        if(task.length!=0){
           task.forEach(function(element,index,array) {
               delete element["product_id"];
               Task.getById("attribute_value",element["attribute_value_id"],"attribute_value_id", function(err, task2) {
                  element["attribute_value"] = task2[0]["value"];
                  Task.getById("attribute",task2[0]["attribute_id"],"attribute_id", function(err, task3) {
                      element["attribute_name"] = task3[0]["name"];
                      if(index == array.length-1)
                      {
                        res.json(task);
                      }               
                  });
              });
            });
        }
        else{
          res.json(task);
        }
        
    });
};