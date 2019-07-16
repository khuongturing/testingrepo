class Errors {
  static databaseError() {
    return {
      code: "DBE_01",
      message: "Database error",
      status: "400"
    };
  }

  static emptyRow(code, type) {
    return {
      code,
      message: `No ${type} exist with this ID`,
      status: "404"
    };
  }

  static invalidInputError(code, value) {
    return {
      code,
      message: `${value} field required`,
      status: "400",
      field: value
    };
  }

  static emailExistsError(code, value) {
    return {
      code: "USR_04",
      message: `The email already exists`,
      status: "400",
      field: "email"
    };
  }

  static invalidInputNumberError(code, value) {
    return {
      code,
      message: `${value} field required and it must be a number`,
      status: "400"
    };
  }

  static invalidIdError(id = "ID") {
    return {
      code: "ID_O1",
      message: `${id} must be a number`,
      status: "400"
    };
  }

  static invalidCurrencyError(i) {
    return {
      code: "ID_O1",
      message: "Currency not supported",
      status: "400"
    };
  }
}

export default Errors;
