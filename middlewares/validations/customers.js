import {
  checkFormData,
  checkEmailField,
  checkId
} from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";

class Validation {
  static validateSignup(req, res, next) {
    const { name, email, password } = req.body;
    if (checkFormData(name)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_01", "name"));
    }
    if (checkEmailField(email)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_01", "email"));
    }
    if (checkFormData(password)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_01", "password"));
    }

    req.body.name = name.replace(/\s+/g, " ");
    req.body.email = email.replace(/\s+/g, " ");
    req.body.password = password.replace(/\s+/g, " ");
    next();
  }

  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (checkEmailField(email)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_01", "email"));
    }
    if (checkFormData(password)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_01", "password"));
    }

    req.body.email = email.replace(/\s+/g, " ");
    req.body.password = password.replace(/\s+/g, " ");
    next();
  }

  static validateAddress(req, res, next) {
    const {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country
    } = req.body;

    if (checkFormData(address_1)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "Address 1"));
    }
    if (checkFormData(address_2)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "Address 2"));
    }
    if (checkFormData(city)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "City"));
    }
    if (checkFormData(region)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "Region"));
    }
    if (checkFormData(country)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "Country"));
    }
    if (checkFormData(postal_code)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_02", "Postal code"));
    }

    req.body.address_1 = address_1.replace(/\s+/g, " ");
    req.body.address_2 = address_2.replace(/\s+/g, " ");
    req.body.city = city.replace(/\s+/g, " ");
    req.body.region = region.replace(/\s+/g, " ");
    req.body.postal_code = postal_code.replace(/\s+/g, " ");
    req.body.country = country.replace(/\s+/g, " ");
    next();
  }

  static validateCreditCard(req, res, next) {
    const { credit_card } = req.body;
    if (checkFormData(credit_card)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("USR_08", "Credit Card"));
    }
    req.body.credit_card = credit_card.replace(/\s+/g, " ");
    next();
  }
}

export default Validation;

