import joi from 'joi';

const stripeToken = joi.string().min(1).max(40).required();
const description = joi.string().min(1).max(200).required();
const currency = joi.string().min(1).max(200).required();
const order_id = joi.number().positive().min(1).required();
const amount = joi.number().positive().min(1).required();

const schema = {
  stripeToken,
  description,
  currency,
  order_id,
  amount,
};

export default schema;
