import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';
import faker from 'faker';

const request = supertest(app);

chai.should();

describe('Product Module', () => {
  const signupData = {
    email: faker.internet.email(),
    password: 'secretpass',
    name: 'John Sam'
  };
  let userToken;

  before((done) => {
    request.post('/api/customers')
      .send(signupData)
      .end((err, res) => {
        userToken = res.body.accessToken;
        done(err);
      });
  });

  describe('GET /products', () => {
    it('should return all products', (done) => {
      request.get('/api/products?limit=10')
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.length(10);

          res.body.rows[0].should.have.property('product_id');
          res.body.rows[0].should.have.property('description');
          res.body.rows[0].should.have.property('name');
          res.body.rows[0].should.have.property('price');
          res.body.rows[0].should.have.property('discounted_price');
          res.body.rows[0].should.have.property('image');
          res.body.rows[0].should.have.property('image_2');
          res.body.rows[0].should.have.property('thumbnail');
          res.body.rows[0].should.have.property('display');
          done(err);
        });
    });
  });

  describe('GET /products/:productId', () => {
    let productId;
    before((done) => {
      request.get('/api/products?limit=1')
        .end((err, res) => {
          productId = res.body.rows[0].product_id;
          done();
        });
    });
    it('should return a single product', (done) => {
      request.get(`/api/products/${productId}`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.have.property('product_id');
          res.body.should.have.property('description');
          res.body.should.have.property('name');
          res.body.should.have.property('price');
          res.body.should.have.property('discounted_price');
          res.body.should.have.property('image');
          res.body.should.have.property('image_2');
          res.body.should.have.property('thumbnail');
          res.body.should.have.property('display');
          done();
        });
    });
    it('return error response when product not found', (done) => {
      request.get('/api/products/0')
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('PRO_01');
          res.body.message.should.be.eql('Don\'t exist product with this ID');
          done();
        });
    });
  });

  describe('GET /products/inCategory/:categoryId', () => {
    const categoryId = 1;
    it('should return a single product', (done) => {
      request.get(`/api/products/inCategory/${categoryId}`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.rows.should.be.a('array');
          res.body.rows[0].should.have.property('product_id');
          res.body.rows[0].should.have.property('description');
          res.body.rows[0].should.have.property('name');
          res.body.rows[0].should.have.property('price');
          res.body.rows[0].should.have.property('discounted_price');
          res.body.rows[0].should.have.property('image');
          res.body.rows[0].should.have.property('image_2');
          res.body.rows[0].should.have.property('thumbnail');
          res.body.rows[0].should.have.property('display');
          done();
        });
    });
    it('return error response when category is not found', (done) => {
      request.get('/api/products/inCategory/0')
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('CAT_01');
          res.body.message.should.be.eql("Don't exist category with this ID");
          done();
        });
    });
  });

  describe('GET /products/inDepartment/:deparmentId', () => {
    const deparmentId = 1;
    it('should return a single product', (done) => {
      request.get(`/api/products/inDepartment/${deparmentId}`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.rows.should.be.a('array');
          res.body.rows[0].should.have.property('product_id');
          res.body.rows[0].should.have.property('description');
          res.body.rows[0].should.have.property('name');
          res.body.rows[0].should.have.property('price');
          res.body.rows[0].should.have.property('discounted_price');
          res.body.rows[0].should.have.property('image');
          res.body.rows[0].should.have.property('image_2');
          res.body.rows[0].should.have.property('thumbnail');
          res.body.rows[0].should.have.property('display');
          done();
        });
    });
    it('return error response when deparment is not found', (done) => {
      request.get('/api/products/inDepartment/0')
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('DEP_01');
          res.body.message.should.be.eql("Don't exist department with this ID");
          done();
        });
    });
  });

  describe('GET /products/search', () => {
    it('should return a single product', (done) => {
      request.get('/api/products/search?query_string=wonderful christmas tshirt')
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.rows.should.be.a('array');
          res.body.rows[0].should.have.property('product_id');
          res.body.rows[0].should.have.property('description');
          res.body.rows[0].should.have.property('name');
          res.body.rows[0].should.have.property('price');
          res.body.rows[0].should.have.property('discounted_price');
          res.body.rows[0].should.have.property('image');
          res.body.rows[0].should.have.property('image_2');
          res.body.rows[0].should.have.property('thumbnail');
          res.body.rows[0].should.have.property('display');
          done();
        });
    });
    it('returns error response when query_string is not supplied', (done) => {
      request.get('/api/products/search')
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(422);
          res.body.code.should.be.eql('PRO_02');
          res.body.message.should.be.eql('Missing search query string');
          done();
        });
    });
  });

  describe('GET /products/:productId/details', () => {
    let productId;
    before((done) => {
      request.get('/api/products?limit=1')
        .end((err, res) => {
          productId = res.body.rows[0].product_id;
          done();
        });
    });
    it('should return a single product', (done) => {
      request.get(`/api/products/${productId}/details`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.have.property('product_id');
          res.body.should.have.property('description');
          res.body.should.have.property('name');
          res.body.should.have.property('price');
          res.body.should.have.property('discounted_price');
          res.body.should.have.property('image');
          res.body.should.have.property('image_2');
          res.body.should.have.property('thumbnail');
          res.body.should.have.property('display');
          done();
        });
    });
    it('return error response when product not found', (done) => {
      request.get('/api/products/0/details')
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('PRO_01');
          res.body.message.should.be.eql('Don\'t exist product with this ID');
          done();
        });
    });
  });

  describe('GET /products/:productId/locations', () => {
    let productId;
    before((done) => {
      request.get('/api/products?limit=1')
        .end((err, res) => {
          productId = res.body.rows[0].product_id;
          done();
        });
    });

    it('should return locations for product', (done) => {
      request.get(`/api/products/${productId}/locations`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body[0].should.have.property('category_id');
          res.body[0].should.have.property('category_name');
          res.body[0].should.have.property('department_id');
          res.body[0].should.have.property('department_name');
          done();
        });
    });
    it('return error response when product not found', (done) => {
      request.get('/api/products/0/locations')
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('PRO_01');
          res.body.message.should.be.eql('Don\'t exist product with this ID');
          done();
        });
    });
  });

  describe('POST /products/:productId/reviews', () => {
    let productId;
    before((done) => {
      request.get('/api/products')
        .end((err, res) => {
          productId = res.body.rows[0].product_id;
          done();
        });
    });
    it('should create a product review', (done) => {
      request.post(`/api/products/${productId}/reviews`)
        .set('USER-KEY', userToken)
        .send({
          review: 'nice one bro',
          rating: 5
        })
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.have.property('created_on');
          res.body.should.have.property('review_id');
          res.body.should.have.property('review');
          res.body.should.have.property('rating');
          res.body.should.have.property('reviewer');
          res.body.should.have.property('product_id');

          res.body.review.should.eql('nice one bro');
          res.body.rating.should.eql(5);
          res.body.product_id.should.eql(productId);
          done();
        });
    });
    it('should return error response if product is not found', (done) => {
      request.post('/api/products/0/reviews')
        .set('USER-KEY', userToken)
        .send({
          review: 'nice one bro',
          rating: 5
        })
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(404);
          res.body.code.should.be.eql('PRO_01');
          res.body.message.should.be.eql('Don\'t exist product with this ID');
          done();
        });
    });
    it('returns error response when input fails validation', (done) => {
      request.post(`/api/products/${productId}/reviews`)
        .set('USER-KEY', userToken)
        .send({
          review: 'nice one',
          rating: 'Number 5'
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(422);
          res.body.code.should.be.eql('REV_01');
          done();
        });
    });
  });
});
