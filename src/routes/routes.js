import express from 'express';
import AttributeController from '../controllers/Attribute';
import DepartmentController from '../controllers/Department';
import CategoryController from '../controllers/Category';
import ProductController from '../controllers/Product';
import CustomerController from '../controllers/Customer';
import ShoppingCartController from '../controllers/ShoppingCart'
import TaxController from '../controllers/Tax';
import ShippingController from '../controllers/Shipping';
import OrdersController from '../controllers/Orders';
import StripePayment from '../controllers/Stripe';
import jwtVerify from '../utils/auth';
import validateRequestBody from '../utils/fieldValidation';
import cacheMiddleware from '../utils/cacheMiddleware';

const router = express.Router();

// Attribute routes
router.get('/attributes', cacheMiddleware(30), AttributeController.getAllAttributes)
router.get('/attributes/:attribute_id', cacheMiddleware(30), AttributeController.getSingleAttribute)
router.get('/attributes/values/:attribute_id', cacheMiddleware(30), AttributeController.attributeValue)
router.get('/attributes/inProduct/:product_id', cacheMiddleware(30), AttributeController.productAttribute)

// Department routes
router.get('/departments', cacheMiddleware(30), DepartmentController.getAllDepartments)
router.get('/departments/:department_id', cacheMiddleware(30), DepartmentController.getSingleDepartment)

// Category routes
router.get('/categories', cacheMiddleware(30), CategoryController.getAllCategories)
router.get('/categories/:category_id', cacheMiddleware(30), CategoryController.getSIngleCategory)
router.get('/categories/inProduct/:product_id', cacheMiddleware(30), CategoryController.productCategory)
router.get('/categories/inDepartment/:department_id', cacheMiddleware(30), CategoryController.departmentCategory)

// Product routes
router.get('/products', cacheMiddleware(30), ProductController.getAllProducts)
router.get('/products/search', cacheMiddleware(30), ProductController.searchProduct)
router.get('/products/:product_id', cacheMiddleware(30), ProductController.getSingleProduct)
router.get('/products/inCategory/:category_id', cacheMiddleware(30), ProductController.categoryOfProduct)
router.get('/products/inDepartment/:department_id', cacheMiddleware(30), ProductController.productDepartment)
router.get('/products/:product_id/details', cacheMiddleware(30), ProductController.productDetail)
router.get('/products/:product_id/reviews', jwtVerify, cacheMiddleware(30), ProductController.productReviews)
router.post('/products/:product_id/reviews', jwtVerify, validateRequestBody, ProductController.postReview)

// Customer routes
router.post('/customers', validateRequestBody, CustomerController.createCustomer)
router.post('/customers/login', validateRequestBody, CustomerController.loginCustomer)
router.put('/customers', jwtVerify, validateRequestBody, CustomerController.updateCustomerProfile)
router.put('/customers/address', jwtVerify, validateRequestBody, CustomerController.updateCustomerAddress)
router.put('/customers/creditCard', jwtVerify, validateRequestBody, CustomerController.customerCreditCard)

// ShoppingCart routes
router.get('/shoppingcart/generateUniqueId', cacheMiddleware(30), ShoppingCartController.generateUniqueId)
router.post('/shoppingcart/add', validateRequestBody, ShoppingCartController.addProductToCart)
router.get('/shoppingcart/:cart_id', cacheMiddleware(30), ShoppingCartController.cartList)
router.put('/shoppingcart/update/:item_id', validateRequestBody, ShoppingCartController.updateCart)
router.delete('/shoppingcart/empty/:cart_id', ShoppingCartController.deleteCart)
router.get('/shoppingcart/totalAmount/:cart_id', cacheMiddleware(30), ShoppingCartController.cartTotalAmount)
router.get('/shoppingcart/saveForLater/:item_id', cacheMiddleware(30), ShoppingCartController.saveItemForLater)
router.get('/shoppingcart/getSaved/:cart_id', cacheMiddleware(30), ShoppingCartController.getSavedItems)
router.delete('/shoppingcart/removeProduct/:item_id', ShoppingCartController.removeProductInCart)

// Tax routes
router.get('/tax', cacheMiddleware(30), TaxController.getAllTaxes)
router.get('/tax/:tax_id', cacheMiddleware(30), TaxController.getSingleTax)

// Shipping routes
router.get('/shipping/regions', cacheMiddleware(30), ShippingController.shippingRegions)
router.get('/shipping/regions/:shipping_region_id', cacheMiddleware(30), ShippingController.shippingRegion)

// Orders routes
router.post('/orders', jwtVerify, OrdersController.createOrder)
router.get('/orders/:order_id', jwtVerify, cacheMiddleware(30), OrdersController.customerOrderInfo)
router.get('/orders/inCustomer', jwtVerify, cacheMiddleware(30), OrdersController.orderByCustomers)
router.get('/orders/shortDetail/:order_id', jwtVerify, cacheMiddleware(30), OrdersController.ordersShortDetail)

// Stripe routes
router.post('/stripe/charge', validateRequestBody, StripePayment.stripeCharge)
router.post('/stripe/webhooks', StripePayment.stripeWebhook)

export default router;
