import express from "express";
import Attributes from "../controllers/attributes";
import Validation from "../middlewares/validations/id";

const route = express.Router();

route.get("/attributes", Attributes.getAllAttributes);
route.get(
  "/attributes/:attribute_id",
  Validation.validateId,
  Attributes.getAttributeById
);
route.get(
  "/attributes/values/:attribute_id",
  Validation.validateId,
  Attributes.getAttributeByValues
);

route.get(
  "/attributes/inProduct/:product_id",
  Validation.validateId,
  Attributes.getAllAttributesByProduct
);

export default route;
