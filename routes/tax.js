import express from "express";
import Tax from "../controllers/tax";
import ValidationId from "../middlewares/validations/id";

const route = express.Router();

route.get("/tax", Tax.getAllTaxes);
route.get("/tax/:tax_id", ValidationId.validateId, Tax.getTaxById);

export default route;
