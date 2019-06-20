const errorResponse = (req, res, status, code, messages, fields) => {
  if (code && code !== '') {
    return {
      error: {
        status,
        code,
        message: messages,
        field: fields
      }
    };
  }
  return {
    error: {
      status,
      message: messages,
      field: fields
    }
  };
};


export default errorResponse;
