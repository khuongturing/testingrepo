import joi from 'joi';

const query_string = joi.string().min(10).max(5000).required();

const schema = {
  query_string,
};

export default schema;
