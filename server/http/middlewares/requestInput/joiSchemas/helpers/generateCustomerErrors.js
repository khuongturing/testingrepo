export const clearDoubleQuotes = (inputField) => {
  return inputField.replace(/"/g, '');
};

const generateCustomerErrors = (error, httpException) => {
  /**
   * the message comes in this format
   * USR_10|422|The email field is less than 10 in character length
   * This is parsed to retreive the errorCode, statusCode and errorMessage
   */
  const { message, type } = error.details[0];
  const parsedMessageArray = message.split('|');

  /**
   * This occurs when fields not validated in the schema are present in the request
   * In such cases, error.details[0].message could be something likes this
   * address is not allowed
   * USR_00 is as a generic code for User field errors
   * given there are quite a lot to cater for
   */
  if (type === 'object.allowUnknown') {
    parsedMessageArray[0] = 'USR_00';
    parsedMessageArray[1] = 422;
    parsedMessageArray[2] = clearDoubleQuotes(message);
  }


  const ERROR_CODE = {
    code: parsedMessageArray[0],
    status: Number(parsedMessageArray[1]),
    message: parsedMessageArray[2],
  };
  return httpException.handle(ERROR_CODE);
};

export default generateCustomerErrors;
