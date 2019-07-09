import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
let UtilityHelper = require('../../lib/utilityHelper')

// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
router.get('/test', (req, res) => {
  console.log('hkhkh')
  res.json("working")
})
router.post(
  '/customers',
  CustomerController.create
);
router.post('/customers/login',  CustomerController.login);
router.get('/customer',UtilityHelper.validateToken, CustomerController.getCustomerProfile);
router.put(
  '/customer', UtilityHelper.validateToken, CustomerController.updateCustomerProfile
);
router.put(
  '/customer/address', UtilityHelper.validateToken, CustomerController.updateCustomerAddress
);
router.put(
  '/customer/creditCard', UtilityHelper.validateToken, CustomerController.updateCreditCard
);

export default router;
