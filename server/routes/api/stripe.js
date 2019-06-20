import express from 'express';
import StripeController from '../../controllers/stripeController';
import Authenticator from '../../middlewares/authenticator';

const { confirmToken } = Authenticator;
const router = express.Router();
router.post('/stripe/charge', confirmToken, StripeController.payWithStripe);
router.post('/stripe/webhooks', StripeController.webhook);
router.get('/stripe/getToken', confirmToken, StripeController.getToken);

export default router;
