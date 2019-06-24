'user strict';

var jwt = require('jsonwebtoken');
var Model = require('../models/appModel.js');
var cardvalidator = require('card-validator');
var uniqid = require('uniqid');
const validatePhoneNumber = require('validate-phone-number-node-js');
const secret = "gh65rv5c567c76v"
const tokenExpire = "1d";
//Task object constructor
var Task = function(task){
    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();
};

Task.tokenGenerator = function(data){
    var result = false;
    try{
        result = jwt.sign({data: data}, secret, { expiresIn: tokenExpire });
    }catch(err) {
        console.log(err);
    }    
    return result;
};

Task.tokenVerification = function(user_key){
    var result = false;
    try {
        result = jwt.verify(user_key.replace(" ","").replace("Bearer",""), secret).data;
    } catch(err) {
        console.log(err);
    }          
    return result;
};

Task.chunk = function (array, size) {
    var results = [];
    while (array.length) {
      results.push(array.splice(0, size));
    }
    return results;
};

Task.getLoginInfo = function(email){
    var procedureName = "customer_get_login_info";
    var params = `"${email}"`;
    var result = false;
    
    Model.callProcedure(procedureName,params,function(err,task){
        if(task[0])
        {
            return task[0];
        }
        else{
            return result;
        }
    });
}

Task.isEmailExist = function(email){
    var result = false;
    if(this.getLoginInfo(email))
        result = true;
    return result;
}

Task.isCardValid = function(number){
    result = false;
    var numberValidation = cardvalidator.number(number);
    if (numberValidation.isPotentiallyValid) {
      result = true;
    }
    return result;
}

Task.isPhoneNumber = function(number)
{
    return validatePhoneNumber.validate(number);
}

Task.uniqueId = function(){
    return uniqid();
}
module.exports = Task;