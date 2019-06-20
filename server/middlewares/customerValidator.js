export default {
  registerValidator(req, res, next) {
    const { email, name, password } = req.body;
    const errors = [];
    if (!email) errors.push('Email is required');
    if (email && email.length > 50) errors.push('The email is too long');
    if (typeof email !== 'string') errors.push('Email must be a string');
    if (!name) errors.push('Name is required');
    if (name && name.length > 50) errors.push('The name is too long');
    if (typeof name !== 'string') errors.push('Name must be a string');
    if (!password) errors.push('Password is required');
    if (password && password.length < 6) errors.push('Password must be at least 6 characters');
    if (typeof password !== 'string') errors.push('Password must be a string');
    if (!errors.length) {
      return next();
    }
    if (errors.length) {
      return res.status(400).json({
        error: {
          status: 400,
          code: 'USR_04',
          message: errors
        }
      });
    }
  },

  loginValidator(req, res, next) {
    const { email, password } = req.body;
    const errors = [];
    if (!email) errors.push('Email is required');
    if (email && email.length > 50) errors.push('The name is too long');
    if (typeof email !== 'string') errors.push('Email must be a string');
    if (!password) errors.push('Password is required');
    if (password && password.length < 6) errors.push('Password must be at least 6 characters');
    if (typeof password !== 'string') errors.push('Password must be a string');
    if (!errors.length) {
      return next();
    }
    if (errors.length) {
      return res.status(400).json({
        error: {
          status: 400,
          code: 'USR_04',
          message: errors
        }
      });
    }
  }
};
