import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';

const request = supertest(app);

chai.should();

describe('Shopping Cart Module', () => {
  describe('GET /shoppingcart/generateUniqueId', () => {
    it('should generate cart id', async () => {
      const res = await request.get('/api/shoppingcart/generateUniqueId');
      res.status.should.be.eql(200);
      res.body.should.have.property('cart_id');
    });
  });

  describe('GET /shoppingcart/add', () => {
    let cartId;
    let productId;
    const newCartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: undefined,
      product_id: undefined,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartId = res.body.cart_id;
      res = await request.get('/api/products');
      productId = res.body.rows[0].product_id;
      newCartItemData.cart_id = cartId;
      newCartItemData.product_id = productId;
    });

    it('should add item to cart', async () => {
      const res = await request.post('/api/shoppingcart/add')
        .send(newCartItemData);

      res.status.should.be.eql(200);
      res.body[0].should.have.property('item_id');
      res.body[0].should.have.property('product_id');
      res.body[0].should.have.property('cart_id');
      res.body[0].should.have.property('attributes');
      res.body[0].should.have.property('quantity');
      res.body[0].should.have.property('buy_now');
      res.body[0].should.have.property('added_on');
      res.body[0].should.have.property('image');
      res.body[0].should.have.property('subtotal');
      res.body[0].cart_id.should.be.eql(newCartItemData.cart_id);
      res.body[0].product_id.should.be.eql(newCartItemData.product_id);
      res.body[0].attributes.should.be.eql(newCartItemData.attributes);
      res.body[0].quantity.should.be.eql(newCartItemData.quantity);
    });
  });

  describe('GET /shoppingcart/:cartId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;
      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;
      res = await request.post('/api/shoppingcart/add').send(cartItemData);
    });

    it('should return items in a cart', async () => {
      const res = await request.get(`/api/shoppingcart/${cartItemData.cart_id}`);
      res.status.should.be.eql(200);
      res.body[0].should.have.property('item_id');
      res.body[0].should.have.property('product_id');
      res.body[0].should.have.property('cart_id');
      res.body[0].should.have.property('attributes');
      res.body[0].should.have.property('quantity');
      res.body[0].should.have.property('buy_now');
      res.body[0].should.have.property('added_on');
      res.body[0].should.have.property('image');
      res.body[0].should.have.property('subtotal');
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.get('/api/shoppingcart/abcd1234');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_03');
      res.body.message.should.be.eql('Don\'t exist cart with this ID');
    });
  });

  describe('PUT /shoppingcart/update/:itemId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;
      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;
      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should update cart item', async () => {
      const res = await request.put(`/api/shoppingcart/update/${cartItemData.item_id}`)
        .send({ quantity: 2 });

      res.status.should.be.eql(200);
      res.body[0].should.have.property('item_id');
      res.body[0].should.have.property('product_id');
      res.body[0].should.have.property('cart_id');
      res.body[0].should.have.property('attributes');
      res.body[0].should.have.property('quantity');
      res.body[0].should.have.property('buy_now');
      res.body[0].should.have.property('added_on');
      res.body[0].should.have.property('image');
      res.body[0].should.have.property('subtotal');
    });

    it('should return error response, if cart item is not found', async () => {
      const res = await request.put('/api/shoppingcart/update/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_02');
      res.body.message.should.be.eql('Don\'t exist cart item with this ID');
    });
  });

  describe('DELETE /shoppingcart/empty/:cartId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;
      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;
      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should empty the cart', async () => {
      const res = await request.delete(`/api/shoppingcart/empty/${cartItemData.cart_id}`);
      res.status.should.be.eql(200);
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.delete('/api/shoppingcart/empty/abc123434');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_03');
      res.body.message.should.be.eql('Don\'t exist cart with this ID');
    });
  });

  describe('GET /shoppingcart/totalAmount/:cartId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;
      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;
      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should get cart amount', async () => {
      const res = await request.get(`/api/shoppingcart/totalAmount/${cartItemData.cart_id}`);
      res.status.should.be.eql(200);
      res.body.should.have.property('total_amount');
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.get('/api/shoppingcart/totalAmount/abc123434');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_03');
      res.body.message.should.be.eql('Don\'t exist cart with this ID');
    });
  });

  describe('GET /shoppingcart/saveForLater/:itemId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;
      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;
      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should get cart amount', async () => {
      const res = await request.get(`/api/shoppingcart/saveForLater/${cartItemData.item_id}`);
      res.status.should.be.eql(200);
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.get('/api/shoppingcart/saveForLater/abc123434');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_02');
      res.body.message.should.be.eql('Don\'t exist cart item with this ID');
    });
  });

  describe('GET /shoppingcart/getSaved/:cartId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;

      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;

      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should get saved items for cart', async () => {
      const res = await request.get(`/api/shoppingcart/getSaved/${cartItemData.cart_id}`);
      res.status.should.be.eql(200);
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.get('/api/shoppingcart/getSaved/abc123434');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_03');
      res.body.message.should.be.eql('Don\'t exist cart with this ID');
    });
  });

  describe('DELETE /shoppingcart/removeProduct/:itemId', () => {
    const cartItemData = {
      attributes: 'LG, Red',
      quantity: 4,
      cart_id: Number,
      product_id: Number,
      item_id: Number,
    };

    before(async () => {
      let res = await request.get('/api/shoppingcart/generateUniqueId');
      cartItemData.cart_id = res.body.cart_id;

      res = await request.get('/api/products');
      cartItemData.product_id = res.body.rows[0].product_id;

      res = await request.post('/api/shoppingcart/add').send(cartItemData);
      cartItemData.item_id = res.body[0].item_id;
    });

    it('should remove product from cart', async () => {
      const res = await request.delete(`/api/shoppingcart/removeProduct/${cartItemData.item_id}`);
      res.status.should.be.eql(200);
    });

    it('should return error response, if cart is not found', async () => {
      const res = await request.delete('/api/shoppingcart/removeProduct/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAR_02');
      res.body.message.should.be.eql('Don\'t exist cart item with this ID');
    });
  });
});
