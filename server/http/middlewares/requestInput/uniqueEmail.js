
import httpException from 'src/http/httpException';
import { Customer as CustomerModel } from 'src/domains/models';
import { ERROR_CODES } from 'src/config/constants';

/**
 * This can be passed as middle to the
 * create and update controllers
 * for the customer domain
 * @param  {Object} req - the request object
 * @param  {Object} res - the response object
 * @param  {Function} next - switch to the next route middleware
 * @return {*} - returns void or next()
 */
const validateUniqueEmail = async (req, res, next) => {
  const { email } = req.body;
  const { decoded: { id: customerId } = {} } = req;
  const customer = await CustomerModel.findByPk(customerId);
  const foundRecord = await CustomerModel.getByField('email', email);

  if (foundRecord && customer === null) {
    // ie. non-existing user trying to regiseter with the email of an existing user
    next(httpException.handle(ERROR_CODES.USR_04));
  } else if (foundRecord && customer.email !== email) {
    // ie. a user trying to change their email to that of an existing user
    next(httpException.handle(ERROR_CODES.USR_04));
  }
  next();
};

export default validateUniqueEmail;
