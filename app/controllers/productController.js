'use strict';
var Task = require('../models/appModel.js');
var Tools = require('../controllers/appController');
var Errors = require('../controllers/errorController');
const table = "product";

exports.list_all_products = function(req, res) {
  Task.getAll(table,function(err, task) {
    var obj = {};
    var error = {};
    if (err)
      console.log(err);
    
    //Set Default Queries Value
    var description_length = 200;
    var page = 0;
    var limit = 20;

    //Get Queries
    if(req.query.description_length)
        description_length = req.query.description_length;

    if(isNaN(description_length) || description_length < 10)
    {
      res.json(Errors.USR_02, Errors.USR_02.error.status);
    }
    else{
    //Get Queries
      if(req.query.page)
        page = req.query.page-1;
      if(req.query.limit)
        limit = req.query.limit;  
      //Count all Items
      obj["count"] = task.length;
      //Set Description Length
      task = task.filter(x=> x.description = x.description.substr(0, description_length));
      //Check Limit Query
      if(isNaN(limit) || limit < 1)
      {
        res.json(Errors.PAG_03,Errors.PAG_03.error.status);
        return ;
      }
      //Filtering Out Some Columns
      task = task.filter(x=>delete x.display);
      task = task.filter(x=>delete x.image);
      task = task.filter(x=>delete x.image_2);
      //Chnuking
      task = Tools.chunk(task,limit);
      if(isNaN(page) || (page < 0 || page > task.length-1))
      {
        res.json(Errors.PRO_01,Errors.PRO_01.error.status);

      }
      else{
        obj["rows"]  = task[page]; 
        if(obj["count"] == 0)
        {
          obj["rows"]= [];  
        }  
        res.json(obj);
      }

      }
  });
};

exports.search_all_products = function(req, res) {
  Task.getAll(table,function(err, task) {
    var obj = {};
    var error = {};
    if (err)
      console.log(err);
    
    //Set Default Queries Value
    var description_length = 200;
    var page = 0;
    var limit = 20;
    var search = "";
    var all_words = "on";

    //Get Queries
    if(req.query.query_string)
        search = req.query.query_string;
    if(req.query.all_words)
        all_words = req.query.all_words;
    if(req.query.description_length)
        description_length = req.query.description_length;
    
    if(all_words != "on" && all_words != "off")
    {
      error["error"] = {
        "status": 400,
        "message": "Allowed all_words query (on|off)",
      } ;
      res.json(error,400);
      return;
    }

    if(isNaN(description_length) || description_length < 10)
    {
      res.json(Errors.USR_02,Errors.USR_02.error.status);

    }
    else{
    //Get Queries
      if(req.query.page)
        page = req.query.page-1;
      if(req.query.limit)
        limit = req.query.limit;  
      //Set Description Length
      task = task.filter(x=> x.description = x.description.substr(0, description_length));
      //Check Limit Query
      if(isNaN(limit) || limit < 1)
      {
        res.json(Errors.PAG_03,Errors.PAG_03.error.status);
        return ;
      }
      //Search Filter
      task = task.filter(function(x){
        if(x.name.includes(search))
        {
          return x;
        }
        else if (x.description.includes(search))
        {
          return x;
        }

      });
      //Filtering Out Some Columns
      task = task.filter(x=>delete x.display);
      task = task.filter(x=>delete x.image);
      task = task.filter(x=>delete x.image_2);
      //Count all Items
      obj["count"] = task.length;
      //Chnuking
      task = Tools.chunk(task,limit);
      if(isNaN(page) || page < 0)
      {
        res.json(Errors.PAG_01, Errors.PAG_01.error.status);

      }
      else{
        obj["rows"]  = task[page]; 
        if(obj["count"] == 0)
        {
          obj["rows"]= [];  
        }
        res.json(obj);
      }

      }
  });
};

exports.get_product_by_id = function(req, res) {
  var id = req.params.product_id;
  var column = "product_id";
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
      res.json(Errors.PRO_01,Errors.PRO_01.error.status);
    }
  });
};

exports.get_product_by_category_id = function(req,res){

  //Define Default Values
  var procedureName = "catalog_get_products_in_category";
  var error = {};
  var obj = {};
  obj["count"] = 0;
  obj["rows"] = [];

  var category_id = 0;
  var page = 0;
  var limit = 20;
  var description_length = 200;
  
  
  //Getting Queries
  if( req.params.category_id && !isNaN(req.params.category_id))
  {
    category_id = req.params.category_id;
  }
  else{
    res.json(obj);
    return;
  }

  if(req.query.page)
  {
    page = req.query.page-1;
  }
  if(isNaN(page) || page < 0)
  {
    res.json(Errors.PAG_01,Errors.PAG_01.error.status);
    return;
  }

  if(req.query.limit)
    limit = req.query.limit;  
  if(req.query.description_length)
    description_length = req.query.description_length;  

  //Calling Store Procedure
  var params = `${category_id},${description_length},999999999,0`;
  Task.callProcedure(procedureName,params,function(err,task){
    if (err)
      console.log(err);
    if(task[0].length && task[0].length > 0)
    {
      //Count Total Items
      obj.count = task[0].length;
      //Chunk
      task[0] = Tools.chunk(task[0],limit);
      if(task[0][page])
      {
        obj.rows = task[0][page];
      } 
    }
    res.json(obj);
  });
};

exports.get_product_by_department_id = function(req,res){

  //Define Default Values
  var procedureName = "catalog_get_products_on_department";
  var error = {};
  var obj = {};
  obj["count"] = 0;
  obj["rows"] = [];

  var department_id = 0;
  var page = 0;
  var limit = 20;
  var description_length = 200;
  
  
  //Getting Queries
  if(req.params.department_id && !isNaN(req.params.department_id))
  {
    department_id = req.params.department_id;
  }
  else{
    res.json(obj);
    return;
  }

  if(req.query.page)
  {
    page = req.query.page-1;
  }
  if(isNaN(page) || page < 0)
  {
    res.json(Errors.PAG_01,Errors.PAG_01.error.status);
    return;
  }

  if(req.query.limit)
    limit = req.query.limit;  
  if(req.query.description_length)
    description_length = req.query.description_length;  

  //Calling Store Procedure
  var params = `${department_id},${description_length},999999999,0`;
  Task.callProcedure(procedureName,params,function(err,task){
    if (err)
      console.log(err);
    if(task[0].length && task[0].length > 0)
    {
      //Count Total Items
      obj.count = task[0].length;
      //Chunk
      task[0] = Tools.chunk(task[0],limit);
      if(task[0][page])
      {
        obj.rows = task[0][page];
      } 
    }
    res.json(obj);
  });
};

exports.get_product_details = function(req,res){

  //Define Default Values
  var procedureName = "catalog_get_product_details";
  var product_id = 0;
  var error = {};
  var obj = [];

  //Getting Queries
  if(req.params.product_id && !isNaN(req.params.product_id))
  {
    product_id = req.params.product_id;
  }
  else{
    res.json(obj);
    return;
  }

  //Calling Store Procedure
  var params = `${product_id}`;
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

exports.get_product_locations = function(req,res){

  //Define Default Values
  var procedureName = "catalog_get_product_locations";
  var product_id = 0;
  var error = {};
  var obj = [];

  //Getting Queries
  if(req.params.product_id && !isNaN(req.params.product_id))
  {
    product_id = req.params.product_id;
  }
  else{
    res.json(obj);
    return;
  }

  //Calling Store Procedure
  var params = `${product_id}`;
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

exports.get_product_reviews = function(req,res){

  //Define Default Values
  var procedureName = "catalog_get_product_reviews";
  var product_id = 0;
  var error = {};
  var obj = [];

  //Getting Queries
  if(req.params.product_id && !isNaN(req.params.product_id))
  {
    product_id = req.params.product_id;
  }
  else{
    res.json(obj);
    return;
  }

  //Calling Store Procedure
  var params = `${product_id}`;
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

exports.create_product_reviews = function(req,res){

  //Define Default Values
  var procedureName = "catalog_create_product_review";
  var customer_id = Tools.tokenVerification(req.headers['user-key']);
  var product_id = req.params.product_id;
  var review = req.body.review;
  var rating = req.body.rating;

  //Authentication
  if(!customer_id)
  {
    res.json(Errors.AUTH_02, Errors.AUTH_02.error.status);
  }
  else{
    //Getting Product ID
    if(!product_id || isNaN(product_id) || isNaN(rating))
    {
      res.json(Errors.USR_02,Errors.USR_02.error.status);
    }
    else{
      //Calling Store Procedure
      var params = `${customer_id},${product_id},"${review}",${rating}`;
      Task.callProcedure(procedureName,params,function(err,task){
        if (err)
        {
          console.log(err);
          res.json(Errors.USR_02,Errors.USR_02.error.status);  
        }
        else
        {
          res.json(Errors.SUCCESS);
        }
      });
    }
  }

};

