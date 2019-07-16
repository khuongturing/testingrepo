import express from "express";
import Stripe from "../controllers/stripe";
import Authentication from "../middlewares/authentication";
import Validation from "../middlewares/validations/stripe";

const route = express.Router();

route.post(
  "/stripe/charge",
  Validation.validateStripe,
  Stripe.charge
);
route.post("/stripe/webhooks", Stripe.webHooks);

export default route;
