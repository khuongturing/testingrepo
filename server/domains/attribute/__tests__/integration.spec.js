import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';

const request = supertest(app);

chai.should();

describe('Attribute Module', () => {
  describe('GET /attributes', () => {
    it('should return all attributes', async () => {
      const res = await request.get('/api/attributes');
      res.status.should.be.eql(200);
      res.body[0].should.have.property('attribute_id');
      res.body[0].should.have.property('name');
    });
  });

  describe('GET /attributes/values/:attributeId', () => {
    let attributeId;

    before(async () => {
      const res = await request.get('/api/attributes');
      attributeId = res.body[0].attribute_id;
    });

    it('should return all values for a specific attribute', async () => {
      const res = await request.get(`/api/attributes/values/${attributeId}`);
      res.status.should.be.eql(200);
      res.body[0].should.have.property('attribute_value_id');
      res.body[0].should.have.property('value');
    });

    it('should return error when attribute is not found', async () => {
      const res = await request.get('/api/attributes/values/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('ATR_01');
      res.body.message.should.be.eql("Don't exist attribute with this ID");
    });
  });

  describe('GET /attributes/inProduct/:productId', () => {
    let productId;

    before(async () => {
      const res = await request.get('/api/products');
      productId = res.body.rows[0].product_id;
    });

    it('should return attributes for a specific product', async () => {
      const res = await request.get(`/api/attributes/inProduct/${productId}`);
      res.status.should.be.eql(200);
      res.body[0].should.have.property('attribute_value_id');
      res.body[0].should.have.property('attribute_name');
      res.body[0].should.have.property('attribute_value');
    });

    it('should return error when product is not found', async () => {
      const res = await request.get('/api/attributes/inProduct/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('PRO_01');
      res.body.message.should.be.eql("Don't exist product with this ID");
    });
  });
});
