import joi from 'joi';

const cart_id = joi.string().min(1).max(12).required();
const shipping_id = joi.number().positive().min(1).required();
const tax_id = joi.number().positive().min(1).required();

const schema = {
  cart_id,
  shipping_id,
  tax_id,
};

export default schema;
