import { Router } from 'express';
import ShippingController from '../../controllers/shipping.controller';
let UtilityHelper = require('../../lib/utilityHelper')

const router = Router();

router.get('/shipping/regions', UtilityHelper.validateToken, ShippingController.getShippingRegions);
router.get('/shipping/regions/:shipping_region_id', UtilityHelper.validateToken, ShippingController.getShippingType);

export default router;
