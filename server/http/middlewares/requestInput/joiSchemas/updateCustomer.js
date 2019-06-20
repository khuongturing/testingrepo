import {
  email,
  name,
  day_phone,
  eve_phone,
  mob_phone,
  passwordUpdate
} from './validationFields/customer';

const schema = {
  email,
  name,
  day_phone,
  eve_phone,
  mob_phone,
  password: passwordUpdate
};

export default schema;
