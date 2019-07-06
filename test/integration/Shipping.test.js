const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Shipping', function shipping() {
  it('get shipping regions list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/shipping/regions`)
    expect(response.body).eql(data.SHIPPING_REGIONS)
  })

  it('get shipping region by id', async function() {
    const region = data.SHIPPING_REGIONS[0]
    const response = await chai.request(app).get(`${baseUrl}/shipping/regions/${region.shipping_region_id}`)
    expect(response.body).eql(region)
  })
})