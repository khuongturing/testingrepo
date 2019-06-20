/* eslint no-unused-expressions: 0 */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);
const cartDetails = {
  cart_id: '',
  product_id: 1,
  attributes: 'color:blue'
};

const cartDetailsUpdate = {
  cart_id: '',
  product_id: 1,
  attributes: 'size:m'
};

const cartDetailsWithInvalidProductId = {
  cart_id: '',
  product_id: 1001,
  attributes: 'color'
};

const customer = {
  email: 'mack@hotmail.com',
  name: 'testuser',
  password: 'Password1!'
};

const orderInfo = {
  cart_id: '',
  shipping_id: 3,
  tax_id: 2
};

const invalidOrderInfo = {
  cart_id: '',
  shipping_id: '3',
  tax_id: 2
};

let cartQuantity = 0;
let cartLength = 0;
let validToken = '';
let orderId = 0;

describe('Shopping Cart', () => {
  it('Should generate a unique id', (done) => {
    chai.request(app)
      .get('/shoppingcart/generateUniqueId')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.cart_id).to.be.a('string');
        expect(res.body.cart_id).to.have.lengthOf(18);
        cartDetails.cart_id = res.body.cart_id;
        cartDetailsUpdate.cart_id = res.body.cart_id;
        orderInfo.cart_id = res.body.cart_id;
        done();
      });
  });

  it('Should add product to cart', (done) => {
    chai.request(app)
      .post('/shoppingcart/add')
      .send(cartDetails)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].attributes).to.equal('color:blue');
        cartQuantity = res.body[0].quantity;
        cartLength += 1;
        done();
      });
  });

  it('Should update product quantity in cart if product exists already with cart id and attribute', (done) => {
    chai.request(app)
      .post('/shoppingcart/add')
      .send(cartDetails)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].quantity).to.equal(cartQuantity + 1);
        expect(res.body).to.have.lengthOf(cartLength);
        expect(res.body[0].attributes).to.equal('color:blue');
        done();
      });
  });

  it('Should add new product in cart if cart id and attribute or attribute differs', (done) => {
    chai.request(app)
      .post('/shoppingcart/add')
      .send(cartDetailsUpdate)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(cartLength + 1);
        done();
      });
  });

  it('Should not add product to cart if product does not exist', (done) => {
    chai.request(app)
      .post('/shoppingcart/add')
      .send(cartDetailsWithInvalidProductId)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Product cannot be found');
        done();
      });
  });

  it('Should get products in cart', (done) => {
    chai.request(app)
      .get(`/shoppingcart/${cartDetails.cart_id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].item_id).to.be.an('number');
        done();
      });
  });

  it('Should login a customer to create an order', (done) => {
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

  it('Should create an order', (done) => {
    chai.request(app)
      .post('/orders')
      .set('USER-KEY', validToken)
      .send(orderInfo)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.orderId).to.be.a('number');
        expect(res.body.orderId).to.equal(1);
        done();
      });
  });

  it('Should not create an order with bad request', (done) => {
    chai.request(app)
      .post('/orders')
      .set('USER-KEY', validToken)
      .send(invalidOrderInfo)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.be.an('array');
        expect(res.body.error.message).to.include('Cart id is required');
        expect(res.body.error.message).to.include('Shipping id must be a number');
        done();
      });
  });

  it('Should get a customer order', (done) => {
    chai.request(app)
      .get('/orders/inCustomer')
      .set('USER-KEY', validToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].order_id).to.equal(1);
        orderId = res.body[0].order_id;
        done();
      });
  });

  it('Should get order info', (done) => {
    chai.request(app)
      .get(`/orders/${orderId}`)
      .set('USER-KEY', validToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].order_id).to.equal(1);
        done();
      });
  });

  it('Should not get order info if order id does not exist', (done) => {
    chai.request(app)
      .get('/orders/20')
      .set('USER-KEY', validToken)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.include('Order id does not exist');
        done();
      });
  });

  it('Should empty the cart', (done) => {
    chai.request(app)
      .delete(`/shoppingcart/empty/${cartDetails.cart_id}`)
      .send({ cart_id: cartDetails.cart_id })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.empty;
        done();
      });
  });
});
