const config = require('config')
const bcrypt = require('bcrypt')
const errors = require('common-errors')
const Joi = require('joi')
const jsonwebtoken = require('jsonwebtoken')
const dbPool = require('./MySqlService')
const STORED_PROCEDURES = config.get('STORED_PROCEDURES')

/**
 * Get logged in customer
 * @param {Number} customerId 
 */
async function getCustomer(customerId) {
  const customer = (await dbPool.query(`call ${STORED_PROCEDURES.GET_CUSTOMER}(?)`, customerId))[0][0]
  delete customer.password
  return customer
}
getCustomer.schema = {
  customerId: Joi.number().integer().required()
}

/**
 * Update customer data
 * @param {Number} customerId 
 * @param {Object} customerData 
 */
async function updateCustomer(customerId, customerData) {
  const customer = await getCustomer(customerId)
  const updatedCustomer = {...customer, ...customerData}
  const { name, email, password, day_phone, eve_phone, mob_phone } = updatedCustomer
  let hashedPassword = password
  if(hashedPassword) {
    hashedPassword = await bcrypt.hash(password, config.get('BCRYPT_SALT_ROUNDS')) // Hash new password if updated
  }
  return dbPool.query(`call ${STORED_PROCEDURES.UPDATE_CUSTOMER}(?, ?, ?, ?, ?, ?, ?)`, [customerId, name, email, hashedPassword, day_phone, eve_phone, mob_phone])
}
updateCustomer.schema = {
  customerId: Joi.number().integer().positive().required(),
  customerData: Joi.object().keys({ 
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string(),
    day_phone: Joi.string(),
    eve_phone: Joi.string(),
    mob_phone: Joi.string()
  }).required()
}

/**
 * Register new customer
 * @param {Object} customerData 
 */
async function createCustomer(customerData) {
  const { name, email, password } = customerData
  const hashedPassword = await bcrypt.hash(password, config.get('BCRYPT_SALT_ROUNDS')) // hash password before storing

  const created =  (await dbPool.query(`call ${STORED_PROCEDURES.CREATE_CUSTOMER}(?, ?, ?)`, [name, email, hashedPassword]))[0][0]
  const customerId = created['LAST_INSERT_ID()']

  const accessToken = jsonwebtoken.sign({ // generate a jwt token with User access
    userId: customerId,
    roles: config.get('JWT.ROLES.USER'),
    createdAt: Date.now()
  }, config.get('JWT.AUTH_SECRET'), {
    expiresIn: config.get('JWT.EXPIRES_IN'),
    issuer: config.get('JWT.DOMAIN')
  })

  delete customerData.password

  return {
    customer: {...customerData, ...{
      customer_id: customerId,
      address_1: null,
      address_2: null,
      credit_card: null,
      day_phone: null,
      eve_phone: null,
      mob_phone: null,
      city: null, 
      region: null, 
      postal_code: null, 
      country: null, 
      shipping_region_id: 1
    }},
    accessToken,
    expires_in: config.get('JWT.EXPIRES_IN')
  }
}
createCustomer.schema = {
  customerData: Joi.object().keys({ 
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  }).required()
}

/**
 * Login customer
 * @param {Object} credentials 
 */
async function loginCustomer(credentials) {
  const { email, password } = credentials
  const loginData = (await dbPool.query(`call ${STORED_PROCEDURES.LOGIN_CUSTOMER}(?)`, email))[0][0]
  if(!loginData) {
    throw new errors.HttpStatusError(404, `Customer with email ${email} was not found`)
  }

  const validCredentials = await bcrypt.compare(password, loginData.password) // Compare hashed password
  if(!validCredentials) {
    throw new errors.HttpStatusError(401, 'Unauthorized')
  }

  const customer = await getCustomer(loginData.customer_id)
  delete customer.password

  const accessToken = jsonwebtoken.sign({ // generate jwt token with User access
    userId: customer.customer_id,
    roles: config.get('JWT.ROLES.USER'),
    createdAt: Date.now()
  }, config.get('JWT.AUTH_SECRET'), {
    expiresIn: config.get('JWT.EXPIRES_IN'),
    issuer: config.get('JWT.DOMAIN')
  })

  return {
    customer,
    accessToken,
    expires_in: config.get('JWT.EXPIRES_IN')
  }
}
loginCustomer.schema = {
  credentials: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}

/**
 * Update address
 * @param {Number} customerId 
 * @param {Object} addressData 
 */
function updateCustomerAddress(customerId, addressData) {
  const { address_1, address_2 = '', city, region, postal_code, country, shipping_region_id } = addressData
  return dbPool.query(`call ${STORED_PROCEDURES.UPDATE_CUSTOMER_ADDRESS}(?, ?, ?, ?, ?, ?, ?, ?)`, [customerId, address_1, address_2, city, region, postal_code, country, shipping_region_id])
}
updateCustomerAddress.schema = {
  customerId: Joi.number().integer().required(),
  addressData: Joi.object().keys({
    address_1: Joi.string().required(),
    address_2: Joi.string(),
    city: Joi.string().required(),
    region: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
    shipping_region_id: Joi.number().integer().required()
  }).required()
}

/**
 * Update credit card information
 * @param {Number} customerId 
 * @param {Object} creditCardData 
 */
function updateCustomerCreditCard(customerId, creditCardData) {
  const { credit_card } = creditCardData
  return dbPool.query(`call ${STORED_PROCEDURES.UPDATE_CUSTOMER_CREDIT_CARD}(?, ?)`, [customerId, credit_card])
}
updateCustomerCreditCard.schema = {
  customerId: Joi.number().integer().required(),
  creditCardData: Joi.object().keys({
    credit_card: Joi.string().required()
  }).required()
}

module.exports = {
  getCustomer,
  updateCustomer,
  createCustomer,
  loginCustomer,
  updateCustomerAddress,
  updateCustomerCreditCard
}