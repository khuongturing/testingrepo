require('./Customer.test') // Execute first to get create customer token
require('./ShoppingCart.test') // Execute first to avoid conflicts in cart items
const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Order', function order() {
  let cart_id
  const shipping_region_id = data.SHIPPING_REGIONS[0].shipping_region_id
  const tax_id = data.TAXES[0].tax_id
  let accessToken
  let customer_id
  let order_id

  before(async function() {
    const product_id = data.PRODUCTS[0].product_id
    const customer = (await chai.request(app).post(`${baseUrl}/customers/login`).send(data.CUSTOMER_CREDENTIALS)).body
    accessToken = customer.accessToken
    customer_id = customer.customer.customer_id

    cart_id = (await chai.request(app).get(`${baseUrl}/shoppingcart/generateUniqueId`)).body.cart_id
    await chai.request(app).post(`${baseUrl}/shoppingcart/add`).send({
      cart_id,
      product_id,
      attributes: 'Size, M'
    })
  })

  it('create order', async function() {
    const response = await chai.request(app).post(`${baseUrl}/orders`).set('Authorization', `Bearer ${accessToken}`).send({
      cart_id,
      customer_id,
      shipping_id: shipping_region_id,
      tax_id
    })
    expect(response.body).eql(data.ORDER)
    order_id = response.body.order_id
  })

  it('get order info', async function() {
    const response = await chai.request(app).get(`${baseUrl}/orders/${order_id}`).set('Authorization', `Bearer ${accessToken}`)
    expect(response.body).eql(data.ORDER_INFO)
  })

  it('get orders by customer', async function() {
    const response = await chai.request(app).get(`${baseUrl}/orders/inCustomer`).set('Authorization', `Bearer ${accessToken}`)
    delete response.body[0].created_on
    expect(response.body).eql(data.ORDERS_IN_CUSTOMER)
  })

  it('get order short detail', async function() {
    const response = await chai.request(app).get(`${baseUrl}/orders/shortDetail/${order_id}`).set('Authorization', `Bearer ${accessToken}`)
    delete response.body.created_on
    expect(response.body).eql(data.ORDER_SHORT_DETAIL)
  })
})