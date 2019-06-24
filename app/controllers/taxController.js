'use strict';

var Task = require('../models/appModel.js');
const table = "tax";

exports.list_all_tax = function(req, res) {
  Task.getAll(table,function(err, task) {
    if (err)
      console.log(err);
    res.json(task);
  });
};

exports.get_by_id = function(req, res) {
  var id = req.params.tax_id;
  var column = "tax_id";
  var error = {};

  if(isNaN(id))
  {
    error["error"] = {
      "status": 400,
      "code": "TAX_01",
      "message": "The ID is not a number.",
      "field": "tax_id"
    } ;
    res.json(error,400);
  }
  else{
      
    Task.getById(table,id,column, function(err, task) {
      if (err)
        console.log(err);
      if(task.length != 0)
      {
        res.json(task[0]);
      }
      else
      {
        error["error"] = {
          "code": "USR_02",
          "message": "The field tax_id is empty.",
          "field": "tax_id",
          "status": "400"
        } ;
        res.json(error,400);
      }
    });
  }
};
