import db from "../models/db";
import error from "../helpers/error";

/**
 *
 *
 * @class Departments
 */
class Departments {
  /**
   *
   * @static
   * @description get all departments
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns retun a response object
   * @memberof Departments
   */
  static getAllDepartments(req, res) {
    db.query(`CALL catalog_get_departments()`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      return res.status(200).json({ result: result[0] });
    });
  }
  /**
   *
   * @static
   * @description get department by id
   * @param {*} req for request object
   * @param {*} res for response object
   * @returns retun a response object
   * @memberof Departments
   */
  static getOneDepartment(req, res) {
    const id = Number(req.params.department_id);
    db.query(`CALL catalog_get_department_details(${id})`, (err, result) => {
      if (err) return res.status(400).json(error.databaseError());
      if (result[0].length === 0) {
        return res.status(404).json(error.emptyRow("DEP_02", "department"));
      }
      return res.status(200).json({ result: result[0][0] });
    });
  }
}

export default Departments;
