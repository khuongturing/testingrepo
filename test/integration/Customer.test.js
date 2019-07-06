const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Customer', function customer() {
  let accessToken = null
  it('create customer', async function() {
    const response = await chai.request(app).post(`${baseUrl}/customers`).send({
      'name': 'Mayur',
      'email': 'activesquare123@gmail.com',
      'password': 'pass'
    })
    const customer = response.body
    expect(customer.customer).eql(data.CUSTOMER.customer)
    expect(customer.accessToken).to.exist
    expect(customer.expires_in).eql(data.CUSTOMER.expires_in)
    accessToken = customer.accessToken
  })

  it('get customer', async function() {
    const response = await chai.request(app).get(`${baseUrl}/customer`).set('Authorization', `Bearer ${accessToken}`)
    expect(response.body).eql(data.CUSTOMER.customer)
  })

  it('update customer', async function() {
    const response = await chai.request(app).put(`${baseUrl}/customer`).set('Authorization', `Bearer ${accessToken}`).send({
      'name': 'Mayur',
      'email': 'activesquare123@gmail.com',
      'password': 'pass',
      'day_phone': '12344321',
      'eve_phone': '12344321',
      'mob_phone': '12344321'
    })
    expect(response.status).eql(200)
  })

  it('update customer address', async function() {
    const response = await chai.request(app).put(`${baseUrl}/customers/address`).set('Authorization', `Bearer ${accessToken}`).send({
      'address_1': 'India',
      'address_2': 'Karnataka',
      'city': 'Bangalore',
      'region': 'Whitefield',
      'postal_code': '560066',
      'country': 'India',
      'shipping_region_id': 1
    })
    expect(response.status).eql(200)
  })

  it('update customer credit card', async function() {
    const response = await chai.request(app).put(`${baseUrl}/customers/creditCard`).set('Authorization', `Bearer ${accessToken}`).send({
      'credit_card': '1234567'
    })
    expect(response.status).eql(200)
  })

  it('login customer', async function() {
    const response = await chai.request(app).post(`${baseUrl}/customers/login`).send(data.CUSTOMER_CREDENTIALS)
    const customer = response.body
    expect(customer.customer).eql(data.UPDATED_CUSTOMER)
    expect(customer.accessToken).to.exist
    expect(customer.expires_in).eql(data.CUSTOMER.expires_in)
  })
})