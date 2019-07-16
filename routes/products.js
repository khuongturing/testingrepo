import express from "express";
import Products from "../controllers/products";
import ValidationId from "../middlewares/validations/id";
import Validation from "../middlewares/validations/products";

const route = express.Router();

route.get("/products", Products.getAllProducts);
route.get(
  "/products/search",
  Validation.validateProductSearch,
  Products.searchProducts
);
route.get(
  "/products/:product_id",
  ValidationId.validateId,
  Products.getProductById
);
route.get(
  "/products/:product_id/details",
  ValidationId.validateId,
  Products.getProductById
);
route.get(
  "/products/:product_id/locations",
  ValidationId.validateId,
  Products.getAllProductsByLocation
);
route.get(
  "/products/:product_id/reviews",
  ValidationId.validateId,
  Products.getAllProductsByReview
);
route.get(
  "/products/inCategory/:category_id",
  ValidationId.validateId,
  Products.getProductsByCategory
);

export default route;
