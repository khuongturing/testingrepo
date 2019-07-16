import express from "express";
import Orders from "../controllers/orders";
import Authentication from "../middlewares/authentication";
import Validation from "../middlewares/validations/orders";

const route = express.Router();

route.get(
  "/orders​/shortDetail​/:order_id",
  Validation.checkOrderId,
  Authentication.verifyUser,
  Orders.shortDetailOrder
);

route.post(
  "/orders",
  Validation.validateOrder,
  Authentication.verifyUser,
  Orders.createOrders
);
route.get(
  "/orders/inCustomer",
  Authentication.verifyUser,
  Orders.getOrdersByCustomer
);
route.get(
  "/orders/:order_id",
  Validation.checkOrderId,
  Authentication.verifyUser,
  Orders.getOrderById
);

export default route;
