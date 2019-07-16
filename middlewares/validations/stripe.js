import {
  checkCurrency,
  checkId,
    checkFormData,
  checkAmount
} from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";

class Stripe {
  static validateStripe(req, res, next) {
    const { stripeToken, order_id, description, amount, currency } = req.body;
    console.log(checkCurrency(currency));
      if (checkCurrency(currency))
      {
      return res.status(400).json(ErrorMessage.invalidCurrencyError());
    }
    if (checkFormData(stripeToken)) {
      res
        .status(400)
        .json(ErrorMessage.invalidInputError("STR_002", "StripeToken"));
    }
    if (checkFormData(description)) {
      res
        .status(400)
        .json(ErrorMessage.invalidInputError("STR_002", "description"));
    }
    if (checkId(amount)) {
      res.status(400).json(ErrorMessage.invalidIdError("amount"));
    }
    if (checkAmount(amount)) {
      res.status(400).json(ErrorMessage.invalidIdError("amount"));
    }
    if (checkId(order_id)) {
      res.status(400).json(ErrorMessage.invalidIdError("order_id"));
    }

    req.body.currency = currency.toUpperCase().trim();
    req.body.stripeToken = stripeToken.replace(/\s+/g, " ");
    req.body.description = description.replace(/\s+/g, " ");
    req.body.order_id = Number(order_id);
    req.body.amount = Number(amount);
    next();
  }
}

export default Stripe;
