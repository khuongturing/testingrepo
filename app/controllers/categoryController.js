'use strict';

var Task = require('../models/appModel.js');
var Errors = require('../controllers/errorController');
const table = "category";

exports.list_all_categories = function(req, res) {
  Task.getAll(table,function(err, task) {
    var obj = {};
    var error = {};
    if (err)
      console.log(err);
    
    //Set Default Queries Value
    var order = "category_id";
    var page = 0;
    var limit = 20;

    //Get Queries
    if(req.query.order)
      order = req.query.order;

    if(order!="category_id" && order!="name")
    {
      res.json(Errors.PAG_02,Errors.PAG_02.error.status);
    }
    else{
      if(req.query.page)
        page = req.query.page-1;
      if(req.query.limit)
        limit = req.query.limit;  
      //Count all Items
      obj["count"] = task.length;

      //Check Limit Query
      if(isNaN(limit) || limit < 1)
      {
        res.json(Errors.PAG_03,Errors.PAG_03.error.status);
        return ;
      }
      //Sorting & Chunk
      task = chunk(Array.prototype.slice.call(task).sort(dynamicSort(order)),limit);
      if(isNaN(page) || (page < 0 || page > task.length-1))
      {
        res.json(Errors.PAG_01, Errors.PAG_01.error.status);
      }
      else{
        obj["rows"]  = task[page];   
        res.json(obj);
      }

      }
  });
};

exports.get_category_by_id = function(req, res) {
  var id = req.params.category_id;
  var column = "category_id";
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
      res.json(Errors.CAT_01,Errors.CAT_01.error.status);
    }
  });
};

exports.get_categories_of_product = function(req, res) {
    var id = req.params.product_id;
    var column = "product_id";
  
    Task.getById("product_category",id,column, function(err, task) {
        if (err)
            console.log(err);
        if(task.length!=0)
        {
            Task.getById(table,task[0]['category_id'],"category_id", function(err, task) {
                if (err)
                    console.log(err);
                delete task[0]["description"];
                res.json(task);
            });
        }
        else{
            res.json(task);
        }
    });
};

exports.get_categories_of_department = function(req, res) {
    var id = req.params.department_id;
    var column = "department_id";
  
    Task.getById(table,id,column, function(err, task) {
        if (err)
            console.log(err);
        res.json(task);
    });
};

function dynamicSort(property) {
    if(/category_id/.test(property))
    {
      return function (a, b) {
        return a[property] - b[property];
      }
    }
    else
    {
      var sortOrder = 1;

      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }

      return function (a,b) {
          if(sortOrder == -1){
              return b[property].localeCompare(a[property]);
          }else{
              return a[property].localeCompare(b[property]);
          }        
      }
    }

};

function chunk(array, size) {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}