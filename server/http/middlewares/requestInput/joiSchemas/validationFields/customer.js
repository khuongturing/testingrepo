import joi from 'joi';
import loadErrors from '../loadErrors';

export const email = joi.string().strict().trim().strict()
  .min(3)
  .max(70)
  .email()
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const password = joi.string().trim().strict()
  .max(40)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const passwordUpdate = joi.string().trim().strict()
  .max(40)
  .error((errors) => {
    return loadErrors(errors);
  });

export const name = joi.string().trim().min(8).max(60)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const credit_card = joi.string().strict().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const address_1 = joi.string().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const address_2 = joi.string().trim().strict()
  .max(100)
  .error((errors) => {
    return loadErrors(errors);
  });

export const city = joi.string().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const region = joi.string().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const postal_code = joi.string().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const country = joi.string().trim().strict()
  .max(100)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const day_phone = joi.string().trim().strict()
  .max(100)
  .error((errors) => {
    return loadErrors(errors);
  });

export const eve_phone = joi.string().trim().strict()
  .max(100)
  .error((errors) => {
    return loadErrors(errors);
  });

export const mob_phone = joi.string().trim().strict()
  .max(100)
  .error((errors) => {
    return loadErrors(errors);
  });

export const access_token = joi.string().trim().strict()
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });

export const shipping_region_id = joi.number().positive().min(1)
  .precision(2)
  .required()
  .error((errors) => {
    return loadErrors(errors);
  });
