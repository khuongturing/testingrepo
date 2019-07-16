import express from "express";
import Categories from "../controllers/categories";
import ValidationId from "../middlewares/validations/id";

const route = express.Router();

route.get("/categories", Categories.getAllCategories);
route.get(
  "/categories/:category_id",
  ValidationId.validateId,
  Categories.getCategoryById
);
route.get(
  "/categories/inProduct/:product_id",
  ValidationId.validateId,
  Categories.getCategoryByProduct
);
route.get(
  "/categories/inDepartment/:department_id",
  ValidationId.validateId,
  Categories.getCategoryByDepartment
);

export default route;
