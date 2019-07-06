const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Tax', function tax() {
  it('get tax list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/tax`)
    expect(response.body).eql(data.TAXES)
  })

  it('get tax by id', async function() {
    const tax = data.TAXES[0]
    const response = await chai.request(app).get(`${baseUrl}/tax/${tax.tax_id}`)
    expect(response.body).eql(tax)
  })
})