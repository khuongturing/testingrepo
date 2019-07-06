import model from '../../models/';
import { errorResponse } from '../utils/errors';

const { Department } = model;


/**
 * @description: A class containing all the Department controllers
 *
 * @class: DepartmentController
 *
 */
class DepartmentController {
    /**
    * @description: This method gets all existing departments
    *
    * @method: getAllDepartments
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing all departments and IDs
    */
    static getAllDepartments = async (req, res, next) => {
        try {
            const departments = await Department.findAll()
            res.json(departments)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a single existing department
    *
    * @method: getSingleDepartment
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing an department
    */
    static getSingleDepartment = async (req, res, next) => {
        try {
            const department = await Department.findByPk(req.params.department_id)
            if (!department) {
                return res.status(404).send(
                    errorResponse("DEP_02", 404,
                        "Don't exist department with this ID",
                        "department_id")
                )
            }
            res.json(department)
        } catch (err) {
            next()
        }
    }
}

export default DepartmentController;
