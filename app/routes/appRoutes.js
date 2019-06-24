'use strict';

//Containing All Route Paths
module.exports = function(app) {

  //Import Controllers
  const departmentController  = require('../controllers/departmentController');
  const categoryController  = require('../controllers/categoryController');
  const attributeController  = require('../controllers/attributeController');
  const productController  = require('../controllers/productController');
  const customerController  = require('../controllers/customerController');
  const ordersController  = require('../controllers/ordersController');
  const shoppingCartController  = require('../controllers/shoppingCartController');
  const taxController  = require('../controllers/taxController');
  const shippingController  = require('../controllers/shippingController');
  const stripeController  = require('../controllers/stripeController');

  // API Docs Generator
  const SwaggerUX = require('swagger-ux');
  const SwaggerDocumentPath =__dirname + "\\swagger.json";
  const SwaggerUXPath = "/api-docs/v2";
  const SwaggerUXoptions = {
      "documentPath": SwaggerDocumentPath,
      "title": "REST-API Document",
      "defaultUI": "redoc",
      "routePath": SwaggerUXPath,
  }
  app.get("/api-docs/api-docs/swagger", function(req, res, next) {
    res.redirect(SwaggerUXPath+"/swagger");
  });
  app.get("/api-docs/v2/api-docs/swagger", function(req, res, next) {
    res.redirect(SwaggerUXPath+"/swagger");
  });
  SwaggerUX.route(app,SwaggerUXoptions); 

  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  var options = {
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      filter: true,
    } 
  };
  app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  
  //------------Express Route------------------
  // Departments Routes  
  var express = require('express')
  var router = express.Router()
  // middleware that is specific to this router
  router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })
  // define get department list route
  router.get('/',departmentController.list_all_departments)
  // get specific department route
  router.get('/:department_id',departmentController.get_by_id)
  //Load Express Router Module
  app.use('/departments',router);
  // app.route('/departments').get(departmentController.list_all_departments)
  // app.route('/departments/:department_id').get(departmentController.get_by_id)
  //------------Express Route------------------

  // Categories Routes
  app.route('/categories').get(categoryController.list_all_categories)
  app.route('/categories/:category_id').get(categoryController.get_category_by_id)
  app.route('/categories/inProduct/:product_id').get(categoryController.get_categories_of_product)
  app.route('/categories/inDepartment/:department_id').get(categoryController.get_categories_of_department)

  // Attributes Routes
  app.route('/attributes').get(attributeController.list_all_attributes)
  app.route('/attributes/:attribute_id').get(attributeController.get_attribute_by_id)
  app.route('/attributes/values/:attribute_id').get(attributeController.get_attribute_value_by_id)
  app.route('/attributes/inProduct/:product_id').get(attributeController.get_attribute_by_productid)

  // Products Routes
  app.route('/products').get(productController.list_all_products)
  app.route('/products/search').get(productController.search_all_products)
  app.route('/products/:product_id').get(productController.get_product_by_id)
  app.route('/products/inCategory/:category_id').get(productController.get_product_by_category_id)
  app.route('/products/inDepartment/:department_id').get(productController.get_product_by_department_id)
  app.route('/products/:product_id/details').get(productController.get_product_details)
  app.route('/products/:product_id/locations').get(productController.get_product_locations)
  app.route('/products/:product_id/reviews').get(productController.get_product_reviews)
  app.route('/products/:product_id/reviews').post(productController.create_product_reviews)

  // Customers Routes
  app.route('/customer').put(customerController.update_customer)
  app.route('/customer').get(customerController.get_customer_by_id)
  app.route('/customers').post(customerController.register_customer)
  app.route('/customers/login').post(customerController.login_customer)
  app.route('/customers/facebook').post(customerController.login_customer_by_facebook)
  app.route('/customers/address').put(customerController.update_customer_address)
  app.route('/customers/creditCard').put(customerController.update_customer_credit_card)

  // Orders Routes
  app.route('/orders').post(ordersController.create_order)
  app.route('/orders/inCustomer').get(ordersController.get_orders_by_customer)
  app.route('/orders/shortDetail/:order_id').get(ordersController.get_order_short_info)
  app.route('/orders/:order_id').get(ordersController.get_order_info)

  // Shoppingcart Routes
  app.route('/shoppingcart/generateUniqueId').get(shoppingCartController.generate_cart_id)
  app.route('/shoppingcart/add').post(shoppingCartController.add_product_to_cart)
  app.route('/shoppingcart/:cart_id').get(shoppingCartController.get_products_list_in_cart)
  app.route('/shoppingcart/update/:item_id').put(shoppingCartController.update_item_in_cart)
  app.route('/shoppingcart/empty/:cart_id').delete(shoppingCartController.empty_cart)
  app.route('/shoppingcart/moveToCart/:item_id').get(shoppingCartController.move_product_to_cart)
  app.route('/shoppingcart/totalAmount/:cart_id').get(shoppingCartController.get_total_amount_from_cart)
  app.route('/shoppingcart/saveForLater/:item_id').get(shoppingCartController.save_product_for_later)
  app.route('/shoppingcart/getSaved/:cart_id').get(shoppingCartController.get_saved_products_from_later)
  app.route('/shoppingcart/removeProduct/:item_id').delete(shoppingCartController.remove_product_from_cart)

  // Tax Routes
  app.route('/tax').get(taxController.list_all_tax)
  app.route('/tax/:tax_id').get(taxController.get_by_id)

  // Shipping Routes
  app.route('/shipping/regions').get(shippingController.list_all_shipping_regions)
  app.route('/shipping/regions/:shipping_region_id').get(shippingController.get_by_region_id)

  // Strip Routes
  app.route('/stripe/charge').post(stripeController.charge)
  app.route('/stripe/webhooks').post(stripeController.webhooks)

  // Route Not Exist
  app.all('*', function(req, res){
    res.json({"error":"NotFoundError: This route doesn't exist!"}, 404);
  });
};