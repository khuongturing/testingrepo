const errors = require('common-errors')
const TaxService = require('../services/TaxService')

async function getTaxes() {
  return await TaxService.getTaxes()
}

async function getTax(req) {
  // Return an error object if the tax is not found
  const tax = (await TaxService.getTax(req.params.tax_id))[0][0] || (new errors.HttpStatusError(404, `Tax with id ${req.params.tax_id} was not found`))
  return tax
}

module.exports = {
  getTaxes,
  getTax
}