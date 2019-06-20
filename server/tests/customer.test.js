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

const customerAddressInfo = {
  address_1: 'Lagos',
  address_2: 'Lagos City',
  city: 'Lagos',
  region: 'West',
  postal_code: '100001',
  country: 'Nigeria',
  shipping_region_id: 2
};

const invalidCustomer = {
  email: 'fake@hotmail.com',
  userName: 'testuser',
  password: 'Pass'
};

const loginInvalidEmail = {
  email: 'fake@hotmail.com',
  userName: 'testuser',
  password: 'Password1!'
};

const loginInvalidDetails = {
  email: 'fake@hotmail.com',
  userName: 'testuser',
  pass: 'Pass'
};


describe('Customers', () => {
  it('Should register customer', (done) => {
    chai.request(app)
      .post('/customers')
      .send(customer)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        expect(res.body.customer).to.be.an('object');
        expect(res.body.customer.name).to.equal('testuser');
        done();
      });
  });

  it('Should not register customer if email exists', (done) => {
    chai.request(app)
      .post('/customers')
      .send(customer)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.include('The email already exists');
        done();
      });
  });

  it('Should not register customer on bad requests', (done) => {
    chai.request(app)
      .post('/customers')
      .send(invalidCustomer)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.be.an('array');
        expect(res.body.error.message).to.include('Name is required');
        expect(res.body.error.message).to.include('Password must be at least 6 characters');
        done();
      });
  });

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

  it('Should not login a customer if email does not exist', (done) => {
    chai.request(app)
      .post('/customers/login')
      .send(loginInvalidEmail)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Email or Password is invalid.');
        done();
      });
  });

  it('Should not login a customer on bad requests', (done) => {
    chai.request(app)
      .post('/customers/login')
      .send(loginInvalidDetails)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.be.an('array');
        expect(res.body.error.message[0]).to.include('Password is required');
        expect(res.body.error.message[1]).to.include('Password must be a string');
        done();
      });
  });

  it('Should update a customer', (done) => {
    chai.request(app)
      .put('/customers/address')
      .set('USER-KEY', validToken)
      .send(customerAddressInfo)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.be.a('string');
        expect(res.body.email).to.be.equal('mack@hotmail.com');
        done();
      });
  });

  it('Should login with facebook', (done) => {
    chai.request(app)
      .get('/login/facebook')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  }).timeout(30000);
});
