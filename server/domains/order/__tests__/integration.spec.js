import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';
import faker from 'faker';

const request = supertest(app);

chai.should();

describe('Order Module', () => {
  describe('/POST /orders', () => {
    let cartId;
    let productId;
    let userToken;

    const newCartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
    };

    const newOrderData = {
      shipping_id: 1,
      tax_id: 1,
      cart_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartId = res.body.cart_id;
      res = await request.get('/api/products');
      productId = res.body.rows[0].product_id;
      newCartItemData.cart_id = cartId;
      newCartItemData.product_id = productId;
      newOrderData.cart_id = cartId;

      res = await request.post('/api/shoppingcart/add').send(newCartItemData);

      res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      userToken = res.body.accessToken;
    });

    it('should create order', async () => {
      const res = await request.post('/api/orders')
        .set('USER-KEY', userToken)
        .send(newOrderData);

      res.status.should.be.eql(200);
      res.body.should.have.property('created_on');
      res.body.should.have.property('status');
      res.body.should.have.property('order_id');
      res.body.should.have.property('total_amount');
      res.body.should.have.property('comments');
      res.body.should.have.property('customer_id');
      res.body.should.have.property('auth_code');
      res.body.should.have.property('reference');
      res.body.should.have.property('shipping_id');
      res.body.should.have.property('tax_id');
    });
  });
});
