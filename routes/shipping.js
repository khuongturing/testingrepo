import express from "express";
import Shipping from "../controllers/shipping";
import ValidationId from "../middlewares/validations/id";

const router = express.Router();

router.get("/shipping/regions", Shipping.getShippingregions);
router.get(
  "/shipping/regions/:shipping_region_id",
  ValidationId.validateId,
  Shipping.getShippingRegionsById
);

export default router;
