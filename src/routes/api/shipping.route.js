import { Router } from 'express';
import ShippingController from '../../controllers/shipping.controller';

const router = Router();

router.get('/shipping/regions', ShippingController.getShippingRegions);                     //Done
router.get('/shipping/regions/:shipping_region_id', ShippingController.getShippingType);    //Done

export default router;
