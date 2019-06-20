const fieldErrorTypeCodes = {
  email: {
    'any.required': 'USR_02',
    'any.empty': 'USR_03',
    'string.max': 'USR_07',
    'string.min': 'USR_10',
    'string.email': 'USR_03'
  },
  password: {
    'any.required': 'USR_02',
    'any.empty': 'USR_03',
    'string.max': 'USR_07',
    'string.min': 'USR_10',
    'string.email': 'USR_03'
  },
};

const loadErrors = (errors) => {
  const { type, context } = errors[0];
  const { key: field } = context;

  let message;
  const status = 422;
  const typeField = fieldErrorTypeCodes[field] || {};
  const errorCode = typeField[type] || 'USR_00';

  switch (type) {
    case 'any.required':
      message = `The ${field} field is required`;
      break;
    case 'string.email':
      message = `The ${field} field is invalid`;
      break;
    case 'any.empty':
      message = `The ${field} field is empty`;
      break;
    case 'string.min':
      message = `The ${field} field is less than ${context.limit} in character length`;
      break;
    case 'string.max':
      message = `The ${field} field is longer than ${context.limit} in character length`;
      break;
    default:
      message = 'failed validation';
  }
  return {
    message: `${errorCode}|${status}|${message}`,
  };
};
export default loadErrors;
