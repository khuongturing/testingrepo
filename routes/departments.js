import express from "express";
import Department from "../controllers/departments";
import ValidationId from "../middlewares/validations/id";

const route = express.Router();

route.get("/departments", Department.getAllDepartments);
route.get(
  "/departments/:department_id",
  ValidationId.validateId,
  Department.getOneDepartment
);

export default route;
