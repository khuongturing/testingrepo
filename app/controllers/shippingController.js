'use strict';

var Task = require('../models/appModel.js');
const table = "shipping";

exports.list_all_shipping_regions = function(req, res) {
  var procedureName = "customer_get_shipping_regions";
  var obj = [];
  //Calling Store Procedure
  var params = "";
  Task.callProcedure(procedureName,params,function(err,task){
    if (err)
      console.log(err);
    if(task[0].length && task[0].length > 0)
    {
        obj = task[0];
    }
    res.json(obj);
  });
};

exports.get_by_region_id = function(req, res) {
  var id = 0;
  var column = "shipping_region_id";
  var error = {};

  if(!req.params.shipping_region_id && isNaN(req.params.shipping_region_id))
  {
    error["error"] = {
        "code": "USR_02",
        "message": "The field shipping_region_id is empty.",
        "field": "shipping_region_id",
        "status": "400"
      } ;
    res.json(error,400);
  }
  else{
    id = req.params.shipping_region_id;
    Task.getById(table,id,column, function(err, task) {
      if (err)
        console.log(err);
      if(task.length != 0)
      {
        res.json(task);
      }
      else
      {
        res.json([]);
      }
    });
  }
};
