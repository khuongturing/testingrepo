import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import {
  getAllAttributes,
  getValuesForAttribute,
  getProductAttributes,
} from './controller';

const attributeRouter = Router();

attributeRouter.get('/attributes',
  wrapAsync(getAllAttributes));

attributeRouter.get('/attributes/values/:attributeId',
  wrapAsync(getValuesForAttribute));

attributeRouter.get('/attributes/inProduct/:productId',
  wrapAsync(getProductAttributes));

export default attributeRouter;
