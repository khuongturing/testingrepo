import express from 'express';
import ShippingRegionController from '../../controllers/shippingRegionController';

const router = express.Router();
router.get('/shipping/regions', ShippingRegionController.allShippingRegions);
router.get('/shipping/regions/:shipping_region_id', ShippingRegionController.getShippingForShippingRegion);

export default router;
