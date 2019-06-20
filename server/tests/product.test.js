import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);

describe('Products', () => {
  it('Should get all products', (done) => {
    chai.request(app)
      .get('/products')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.equal(4);
        expect(res.body.rows).to.be.an('array');
        done();
      });
  });

  it('Should get a single product', (done) => {
    chai.request(app)
      .get('/products/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.be.an('string');
        done();
      });
  });

  it('Should give 404 if product does not exist', (done) => {
    chai.request(app)
      .get('/products/1000')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.be.a('string');
        expect(res.body.error.message).to.include('Product cannot be found');
        done();
      });
  });

  it('Should get products in a category', (done) => {
    chai.request(app)
      .get('/products/inCategory/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        done();
      });
  });

  it('Should get products in a category by limit', (done) => {
    chai.request(app)
      .get('/products/inCategory/1?limit=4')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        expect(res.body.rows).to.have.lengthOf(2);
        done();
      });
  });

  it('Should get products in a category by description length', (done) => {
    chai.request(app)
      .get('/products/inCategory/1?limit=4&description_length=50')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        expect(res.body.rows).to.have.lengthOf(2);
        expect(res.body.rows[0].description).to.have.lengthOf.below(50 + 4);
        done();
      });
  });

  it('Should show 404 if no category', (done) => {
    chai.request(app)
      .get('/products/inCategory/1000')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.include('Don\'t exist category with this ID');
        done();
      });
  });

  it('Should get products in a department', (done) => {
    chai.request(app)
      .get('/products/inDepartment/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        done();
      });
  });

  it('Should get products in a department by limit', (done) => {
    chai.request(app)
      .get('/products/inDepartment/1?limit=4')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        expect(res.body.rows).to.have.lengthOf(2);
        done();
      });
  });

  it('Should get products in a department by description length', (done) => {
    chai.request(app)
      .get('/products/inDepartment/1?limit=4&description_length=50')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        expect(res.body.rows).to.have.lengthOf(2);
        expect(res.body.rows[0].description).to.have.lengthOf.below(50 + 4);
        done();
      });
  });

  it('Should show 404 if no department', (done) => {
    chai.request(app)
      .get('/products/inDepartment/1000')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.include('Department with this id does not exist');
        done();
      });
  });

  it('Search for products', (done) => {
    chai.request(app)
      .get('/products/search?query_string=good&page=1&limit=4&description_length=50')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.a('number');
        expect(res.body.rows).to.an('array');
        expect(res.body.rows).to.have.lengthOf.below(5);
        expect(res.body.rows[0].description).to.have.lengthOf.below(50 + 4);
        done();
      });
  });

  it('Show 400 on invalid query params when getting products', (done) => {
    chai.request(app)
      .get('/products?limit=1ab')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error.status).to.equal(400);
        expect(res.body.error.message).to.an('array');
        done();
      });
  });
});
