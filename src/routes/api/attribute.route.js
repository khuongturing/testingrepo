import { Router } from 'express';
import AttributeController from '../../controllers/attributes.controller';
let UtilityHelper = require('../../lib/utilityHelper')

const router = Router();

router.get('/attributes', UtilityHelper.validateToken, AttributeController.getAllAttributes);
router.get('/attributes/:attribute_id', UtilityHelper.validateToken, AttributeController.getSingleAttribute);
router.get('/attributes/values/:attribute_id', UtilityHelper.validateToken, AttributeController.getAttributeValues);
router.get('/attributes/inProduct/:product_id', UtilityHelper.validateToken, AttributeController.getProductAttributes);

export default router;
