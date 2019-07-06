const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')
const data = require('../data')

const expect = chai.expect
chai.use(chaiHttp)
const baseUrl = `/${config.get('SERVER.API_VERSION')}`

describe('Department', function department() {
  it('get department list', async function() {
    const response = await chai.request(app).get(`${baseUrl}/departments`)
    expect(response.body).eql(data.DEPARTMENTS)
  })

  it('get department', async function() {
    const department = data.DEPARTMENTS[0]
    const response = await chai.request(app).get(`${baseUrl}/departments/${department.department_id}`)
    expect(response.body).eql(department)
  })
})