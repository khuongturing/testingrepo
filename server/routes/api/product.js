import express from 'express';
import ProductController from '../../controllers/productController';
import productValidator from '../../middlewares/productValidator';
import productCaching from '../../middlewares/caching/productCaching';

const router = express.Router();
router.get('/products', productValidator.validateQueryParams, productCaching.allProductsCaching, ProductController.viewAllProducts);
router.get('/products/search', productValidator.validateQueryParams, productCaching.searchProductsCaching, ProductController.searchProducts);
router.get('/products/:product_id', ProductController.viewSingleProduct);
router.get('/products/inCategory/:categoryId', productValidator.validateQueryParams, productCaching.categoryProductsCaching, ProductController.getProductsInCategory);
router.get('/products/inDepartment/:departmentId', productValidator.validateQueryParams, productCaching.departmentProductsCaching, ProductController.getProductsInDepartment);

export default router;
