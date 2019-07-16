import { checkId } from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";
class ValidateId {
  static validateId(req, res, next) {
    const id =
      req.params.attribute_id ||
      req.params.product_id ||
      req.params.category_id ||
      req.params.department_id ||
      req.params.order_id ||
      req.params.shipping_region_id ||
      req.params.item_id ||
      req.params.cart_id ||
      req.params.tax_id;
    if (checkId(id)) {
      return res.status(400).json(ErrorMessage.invalidIdError());
    }
    next();
  }
}

export default ValidateId;
