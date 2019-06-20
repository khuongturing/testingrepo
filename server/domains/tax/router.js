import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import {
  getAllTaxes,
  getTaxById,
} from './controller';

const taxRouter = Router();

taxRouter.get('/tax',
  wrapAsync(getAllTaxes));

taxRouter.get('/tax/:taxId',
  wrapAsync(getTaxById));

export default taxRouter;
