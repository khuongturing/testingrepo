import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);

describe('Categories', () => {
  it('Should get all categories', (done) => {
    chai.request(app)
      .get('/categories')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.equal(4);
        expect(res.body.rows).to.be.an('array');
        done();
      });
  });

  it('Should get all categories with filters', (done) => {
    chai.request(app)
      .get('/categories?page=1&limit=2&order=category_id')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.count).to.be.equal(4);
        expect(res.body.rows).to.have.lengthOf(2);
        expect(res.body.rows).to.be.an('array');
        done();
      });
  });

  it('Should get a single category', (done) => {
    chai.request(app)
      .get('/categories/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('French');
        done();
      });
  });

  it('Should show 400 if category id is not a number when getting a category', (done) => {
    chai.request(app)
      .get('/categories/1nn')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.message).to.equal('The ID is not a number.');
        done();
      });
  });

  it('Should show 404 if no category with given id', (done) => {
    chai.request(app)
      .get('/categories/10')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Category cannot be found');
        done();
      });
  });

  it('Should get the category of a product', (done) => {
    chai.request(app)
      .get('/categories/inProduct/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].name).to.equal('French');
        done();
      });
  });

  it('Should show 404 if product does not exist when getting the category of a product', (done) => {
    chai.request(app)
      .get('/categories/inProduct/10')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Product cannot be found');
        done();
      });
  });

  it('Should show 400 if product id is not a number when getting category of a product', (done) => {
    chai.request(app)
      .get('/categories/inProduct/1nn')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.message).to.equal('The ID is not a number.');
        done();
      });
  });

  it('Should get the category of a department', (done) => {
    chai.request(app)
      .get('/categories/inDepartment/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].name).to.equal('French');
        done();
      });
  });

  it('Should show 404 if department does not exist when getting the category of a department', (done) => {
    chai.request(app)
      .get('/categories/inDepartment/10')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Department cannot be found');
        done();
      });
  });

  it('Should show 400 if department id is not a number when getting category of a department', (done) => {
    chai.request(app)
      .get('/categories/inDepartment/1nn')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.message).to.equal('The ID is not a number.');
        done();
      });
  });
});
