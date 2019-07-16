import express from "express";
import ShoppingCart from "../controllers/shoppingcart";
import ValidationId from "../middlewares/validations/id";
import Validation from "../middlewares/validations/shoppingcart";

const route = express.Router();

route.get("/shoppingcart/generateUniqueId", ShoppingCart.generateCartId);
route.post(
  "/shoppingcart/add",
  Validation.validateShoppinCart,
  ShoppingCart.addShoppingCart
);
route.get(
  "/shoppingcart/:cart_id",
  ValidationId.validateId,
  ShoppingCart.getShoppingCartById
);
route.put(
  "/shoppingcart/update/:item_id",
  ValidationId.validateId,
  Validation.validateQuantity,
  ShoppingCart.updateShoppingCart
);
route.delete(
  "/shoppingcart/empty/:cart_id",
  ValidationId.validateId,
  ShoppingCart.deleteShoppingCart
);
route.get(
  "/shoppingcart/moveToCart/:item_id",
  ValidationId.validateId,
  ShoppingCart.moveProductToShoppingCart
);
route.get(
  "/shoppingcart/totalAmount/:cart_id",
  ValidationId.validateId,
  ShoppingCart.getTotalAmountOfShoppingCart
);
route.get(
  "/shoppingcart/saveForLater/:item_id",
  ValidationId.validateId,
  ShoppingCart.saveCartForLater
);
route.get(
  "/shoppingcart/getSaved/:cart_id",
  ValidationId.validateId,
  ShoppingCart.getSavedProducts
);
route.delete(
  "/shoppingcart/removeProduct/:item_id",
  ValidationId.validateId,
  ShoppingCart.removeCart
);

export default route;
