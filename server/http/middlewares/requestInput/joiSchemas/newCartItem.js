import joi from 'joi';

const cart_id = joi.string().min(1).max(12).required();
const product_id = joi.number().positive().min(1).required();
const attributes = joi.string().max(5000).required();
const quantity = joi.number().positive().min(1);

const schema = {
  cart_id,
  product_id,
  attributes,
  quantity,
};

export default schema;
