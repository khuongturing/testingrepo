import { checkFormData, checkId } from "../../helpers/checkFormData";
import ErrorMessage from "../../helpers/error";

class Validation {
  static validateProductSearch(req, res, next) {
    const { query_string, all_words } = req.query;
    const description_length = req.query.description_length;
    const limit = req.query.limit;
    const page = req.query.page;
    if (checkFormData(query_string)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("PRO_02", "query_string"));
    }
    if (checkFormData(all_words)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidInputError("PRO_02", "all_words"));
    }
    if (checkId(description_length)) {
      return res
        .status(400)
        .json(ErrorMessage.invalidIdError("description_length"));
    }
    if (checkId(limit)) {
      return res.status(400).json(ErrorMessage.invalidIdError("limit"));
    }
    if (checkId(page)) {
      return res.status(400).json(ErrorMessage.invalidIdError("page"));
    }
    req.query.query_string = query_string.replace(/\s+/g, " ");
    req.query.all_words = all_words.replace(/\s+/g, " ");
    req.body.description_length = Number(description_length);
    req.body.limit = Number(limit);
    req.body.page = Number(page);
    next();
  }
}

export default Validation;
