import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);

let validToken = '';

const customer = {
  email: 'mack@hotmail.com',
  name: 'testuser',
  password: 'Password1!'
};


describe('Customers', () => {
  it('Should login a customer', (done) => {
    chai.request(app)
      .post('/customers/login')
      .send(customer)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.customer).to.be.an('object');
        expect(res.body.customer.name).to.be.a('string');
        expect(res.body.accessToken).to.be.a('string');
        validToken = res.body.accessToken;
        done();
      });
  });

  it('Should return true for stripe webhook', (done) => {
    chai.request(app)
      .post('/stripe/webhooks')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.received).to.equal(true);
        done();
      });
  });

  it('Should get stripe token', (done) => {
    chai.request(app)
      .get('/stripe/getToken')
      .set('USER-KEY', validToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.stripeToken).to.be.a('string');
        done();
      })
      .timeout(20000);
  });
});
