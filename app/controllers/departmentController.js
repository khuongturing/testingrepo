'use strict';

var Task = require('../models/appModel.js');
var Errors = require('../controllers/errorController');
const table = "department";

exports.list_all_departments = function(req, res) {
  Task.getAll(table,function(err, task) {
    if (err)
      console.log(err);
    res.json(task);
  });
};

exports.get_by_id = function(req, res) {
  var id = req.params.department_id;
  var column = "department_id";
  var error = {};

  if(isNaN(id))
  {
    res.json(Errors.DEP_01, Errors.DEP_01.error.status);
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
        res.json(Errors.DEP_02, Errors.DEP_02.error.status);

      }
    });
  }
};
