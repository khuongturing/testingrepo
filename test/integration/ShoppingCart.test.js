const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Shopping cart', function cart() {
  let cart_id = null

  it('generate unique cart id', async function() {
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/generateUniqueId`)
    expect(response.body.cart_id).to.exist
    cart_id = response.body.cart_id
  })

  it('add product to cart', async function() {
    const product_id = data.PRODUCTS[0].product_id
    const response = await chai.request(app).post(`${baseUrl}/shoppingcart/add`).send({
      cart_id,
      product_id,
      attributes: 'Size, M'
    })
    expect(response.body).eql(data.CART_ITEMS)
  })

  it('get items in cart', async function() {
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/${cart_id}`)
    expect(response.body).eql(data.CART_ITEMS)
  })

  it('update items in cart', async function() {
    const item_id = data.CART_ITEMS[0].item_id
    const response = await chai.request(app).put(`${baseUrl}/shoppingcart/update/${item_id}`).send({
      'quantity': 2
    })
    expect(response.status).eql(200)
  })

  it('move item to cart', async function() {
    const item_id = data.CART_ITEMS[0].item_id
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/moveToCart/${item_id}`)
    expect(response.status).eql(200)
  })

  it('get total cart amount', async function() {
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/totalAmount/${cart_id}`)
    expect(response.body).eql(data.TOTAL_CART_AMOUNT)
  })

  it('save product for later', async function() {
    const item_id = data.CART_ITEMS[0].item_id
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/saveForLater/${item_id}`)
    expect(response.status).eql(200)
  })

  it('get saved products', async function() {
    const response = await chai.request(app).get(`${baseUrl}/shoppingcart/getSaved/${cart_id}`)
    expect(response.body).eql(data.SAVED_PRODUCTS)
  })

  it('remove products from cart', async function() {
    const item_id = data.CART_ITEMS[0].item_id
    const response = await chai.request(app).delete(`${baseUrl}/shoppingcart/removeProduct/${item_id}`)
    expect(response.status).eql(200)
  })    

  it('empty cart', async function() {
    const response = await chai.request(app).delete(`${baseUrl}/shoppingcart/empty/${cart_id}`)
    expect(response.body).eql([])
  })
})