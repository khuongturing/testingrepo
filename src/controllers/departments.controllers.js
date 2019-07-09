/**
 * The controller defined below is the department controller, highlighted below are the functions of each static method
 * in the controller
 *  Some methods needs to be implemented from scratch while others may contain one or two bugs
 * 
 * - getAllDepartments - This method should return an array of all departments
 * - getSingleDepartment - This method should return a single department using the department_id in the request parameter
 * NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */

import { Department } from '../database/models';
let log = require('fancy-log');
let UtilityHelper = require('../lib/utilityHelper');
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager');

class DepartmentController {
    /**
     * This method get all departments
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getAllDepartments(req, res, next) {        
      try{
        let {rows, count} = await Department.findAndCountAll();
        return Response.success(res, {departments: rows, count})
    }catch(error){
        log.error(`Error Getting Departments {error: ${error}}`);
        return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    }
  
    /**
     * This method gets a single Department using the department id
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getSingleDepartment(req, res, next) {
      let {department_id} = req.params;
      if(!department_id || typeof parseInt(department_id) !== "number")
                return Response.failure(res, responseMessages.DEPARTMENT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'department_id')

      try{
          let department = await Department.findByPk(department_id);
          if(!department) return Response.failure(res, responseMessages.DEPARTMENT_NOT_EXISTS, HttpStatus.NOT_FOUND);
          
          return Response.success(res, {department})
      }catch(error){
          log.error(`Error Getting Department Details for department_id : ${department_id}, {error: ${error}}`);
          return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
  export default DepartmentController;
  