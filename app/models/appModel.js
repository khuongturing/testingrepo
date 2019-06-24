'user strict';
var sql = require('../../db.js');

//Task object constructor
var Task = function(task){
    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();
};


Task.getById = function getByID(table,Id,column, result) {
    sql.query("Select * from "+table+" where "+column+" = ? ", Id, function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                result(null, res);
            }
        });   
};

Task.getAll = function getAll(table,result) {
        sql.query("Select * from "+table, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                 result(null, res);
                }
            });   
};

Task.callProcedure = function procedure(procedureName,params,result) {
    sql.query("CALL "+procedureName+"("+params+")", function (err, res) {

            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
             result(null, res);
            }
        });   
};



module.exports= Task;