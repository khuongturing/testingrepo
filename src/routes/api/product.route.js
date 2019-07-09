import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
let UtilityHelper = require('../../lib/utilityHelper')

// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
router.get('/products', ProductController.getAllProducts);
router.get('/products/search', ProductController.searchProduct);
router.get('/products/:product_id', ProductController.getProduct);
router.get('/products/inCategory/:category_id',ProductController.getProductsByCategory);
router.get('/products/inDepartment/:department_id',  ProductController.getProductsByDepartment);
router.get('/products/:product_id/details', ProductController.getProduct);
router.get('/products/:product_id/locations', ProductController.getProductLocations);
router.post('/products/:product_id/reviews', UtilityHelper.validateToken, ProductController.createReview);
router.get('/products/:product_id/reviews', UtilityHelper.validateToken, ProductController.getReviews);


router.get('/categories', UtilityHelper.validateToken, ProductController.getAllCategories);
router.get('/categories/:category_id', UtilityHelper.validateToken, ProductController.getSingleCategory);
router.get('/categories/inProduct/:product_id', UtilityHelper.validateToken, ProductController.getProductCategories);
router.get('/categories/inDepartment/:department_id', UtilityHelper.validateToken, ProductController.getDepartmentCategories);

export default router;
