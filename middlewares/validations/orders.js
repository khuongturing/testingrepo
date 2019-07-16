import { checkId, checkFormData } from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";

class Validation {
  static validateOrder(req, res, next) {
    const { cart_id, shipping_id, tax_id } = req.body;
    if (checkId(cart_id)) {
      return res.status(400).json(ErrorMessage.invalidIdError("cart_id"));
    }
    if (checkId(shipping_id)) {
      return res.status(400).json(ErrorMessage.invalidIdError("shipping_id"));
    }
    if (checkId(tax_id)) {
      return res.status(400).json(ErrorMessage.invalidIdError("tax_id"));
    }
    req.body.cart_id = Number(cart_id);
    req.body.shipping_id = Number(shipping_id);
    req.body.tax_id = Number(tax_id);
    next();
  }

  static checkOrderId(req, res, next) {
    const { order_id } = req.params;
    if (checkFormData(order_id)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidIdError("ORD_1", "order_id"));
    }
    next();
  }
}

export default Validation;
