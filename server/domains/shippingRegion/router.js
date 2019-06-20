import { Router } from 'express';
import wrapAsync from 'src/http/wrapAsync';
import {
  getShippingRegions,
  getShippingsForARegion
} from './controller';

const shippingRouter = Router();

shippingRouter.get('/shipping/regions',
  wrapAsync(getShippingRegions));

shippingRouter.get('/shipping/regions/:shippingRegionId',
  wrapAsync(getShippingsForARegion));

export default shippingRouter;
