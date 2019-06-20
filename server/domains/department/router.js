import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import {
  getAllDepartments,
  getSingleDepartment,
} from './controller';

const productRouter = Router();

productRouter.get('/departments',
  wrapAsync(getAllDepartments));

productRouter.get('/departments/:departmentId',
  wrapAsync(getSingleDepartment));

export default productRouter;
