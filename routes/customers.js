import express from "express";
import Customers from "../controllers/customers";
import Validation from "../middlewares/validations/customers";
import Authentication from "../middlewares/authentication";
import db from "../models/db";
const route = express.Router();

route.post("/customers", Validation.validateSignup, Customers.createCustomer);
route.get("/customers", Authentication.verifyUser, Customers.getCustomer);
route.post("/customers/login", Validation.validateLogin, Customers.loginUser);
route.put(
  "/customers/address",
  Validation.validateAddress,
  Authentication.verifyUser,
  Customers.updateAddress
);
route.put(
  "/customers/creditCard",
  Validation.validateCreditCard,
  Authentication.verifyUser,
  Customers.updateCreditcard
);

export default route;
