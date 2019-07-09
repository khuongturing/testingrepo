import { Router } from 'express';
import TaxController from '../../controllers/tax.controller';
let UtilityHelper = require('../../lib/utilityHelper')

const router = Router();

// These are valid routes but they may contain a bug, please try to define and fix them

router.get('/tax', UtilityHelper.validateToken, TaxController.getAllTax);
router.get('/tax/:tax_id', UtilityHelper.validateToken, TaxController.getSingleTax);

export default router;
