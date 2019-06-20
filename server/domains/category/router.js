import { Router } from 'express';
import { validatePage, validateOrderBy } from 'src/http/middlewares/pagination';
import wrapAsync from 'src/http/wrapAsync';
import {
  getAllCategories,
  getProductCategories,
  getDepartmentCategories,
  getSingleCategory,
} from './controller';

const categoryRouter = Router();

categoryRouter.get('/categories',
  validatePage,
  validateOrderBy('category'),
  wrapAsync(getAllCategories));

categoryRouter.get('/categories/:categoryId',
  wrapAsync(getSingleCategory));

categoryRouter.get('/categories/inProduct/:productId',
  validateOrderBy('category'),
  wrapAsync(getProductCategories));

categoryRouter.get('/categories/inDepartment/:departmentId',
  validateOrderBy('category'),
  wrapAsync(getDepartmentCategories));

export default categoryRouter;
