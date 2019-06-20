import express from 'express';
import CustomerController from '../../controllers/customerController';
import customerValidator from '../../middlewares/customerValidator';
import Authenticator from '../../middlewares/authenticator';

const { loginValidator, registerValidator } = customerValidator;
const { confirmToken } = Authenticator;

const router = express.Router();
router.post('/customers', registerValidator, CustomerController.RegisterCustomer);
router.post('/customers/login', loginValidator, CustomerController.LoginCustomer);
router.put('/customers/address', confirmToken, CustomerController.UpdateCustomerAddress);

export default router;
