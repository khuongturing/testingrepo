/**
 * Aggregates all routes
 */
const AttributeRoutes = require('./AttributeRoutes')
const CategoryRoutes = require('./CategoryRoutes')
const CustomerRoutes = require('./CustomerRoutes')
const DepartmentRoutes = require('./DepartmentRoutes')
const OrderRoutes = require('./OrderRoutes')
const ProductRoutes = require('./ProductRoutes')
const ShippingRoutes = require('./ShippingRoutes')
const ShoppingCartRoutes = require('./ShoppingCartRoutes')
const StripeRoutes = require('./StripeRoutes')
const TaxRoutes = require('./TaxRoutes')

module.exports = Object.assign({}, AttributeRoutes,
  CategoryRoutes,
  CustomerRoutes,
  DepartmentRoutes,
  OrderRoutes,
  ProductRoutes,
  ShippingRoutes,
  ShoppingCartRoutes,
  StripeRoutes,
  TaxRoutes
)