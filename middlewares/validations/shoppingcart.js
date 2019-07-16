import { checkFormData, checkId } from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";

class Validation {
  static validateShoppinCart(req, res, next) {
    const { cart_id, product_id, attributes } = req.body;
    if (checkFormData(attributes)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("SHC_02", "attributes"));
    }
    if (checkId(cart_id)) {
      return res.status(400).json(ErrorMessage.invalidIdError("cart_id"));
    }
    if (checkId(product_id)) {
      return res.status(400).json(ErrorMessage.invalidIdError("product_id"));
    }

    req.body.cart_id = Number(cart_id);
    req.body.product_id = Number(product_id);
    req.body.attributes = attributes.replace(/\s+/g, " ");
    next();
  }

  static validateQuantity(req, res, next) {
    const { quantity } = req.body;
    if (checkId(quantity)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputNumberError("SHC_02", "quantity"));
    }
      req.body.quantity = Number(quantity);
      next();
  }
}

export default Validation;
