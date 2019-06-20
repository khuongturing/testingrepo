import joi from 'joi';

const review = joi.string().min(10).max(5000).required();
const rating = joi.number().positive().min(1).max(5)
  .required();

const schema = {
  review,
  rating,
};

export default schema;
