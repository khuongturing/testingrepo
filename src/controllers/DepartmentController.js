const errors = require('common-errors')
const DepartmentService = require('../services/DepartmentService')

async function getDepartments() {
  return await DepartmentService.getDepartments()
}

async function getDepartment(req) {
  // Return an error object if the department is not found
  const department = (await DepartmentService.getDepartment(req.params.department_id))[0][0] || (new errors.HttpStatusError(404, `Department with id ${req.params.department_id} was not found`))
  return department
}

module.exports = {
  getDepartments,
  getDepartment
}