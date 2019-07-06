const errors = require('common-errors')
const ShippingService = require('../services/ShippingService')

async function getShippingRegions() {
  return await ShippingService.getShippingRegions()
}

async function getShippingRegion(req) {
  // Return an error object if the region is not found
  const shippingRegion = (await ShippingService.getShippingRegion(req.params.shipping_region_id))[0][0] || (new errors.HttpStatusError(404, `Shipping region with id ${req.params.shipping_region_id} was not found`))
  return shippingRegion
}

module.exports = {
  getShippingRegions,
  getShippingRegion
}
