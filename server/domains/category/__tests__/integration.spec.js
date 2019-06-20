import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';

const request = supertest(app);

chai.should();

describe('Category Module', () => {
  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const res = await request.get('/api/categories');
      res.status.should.be.eql(200);
      res.body[0].should.have.property('category_id');
      res.body[0].should.have.property('department_id');
      res.body[0].should.have.property('description');
      res.body[0].should.have.property('name');
    });
  });

  describe('GET /categories/:categoryId', () => {
    let categoryId;

    before(async () => {
      const res = await request.get('/api/categories');
      categoryId = res.body[0].category_id;
    });

    it('should return a specific category', async () => {
      const res = await request.get(`/api/categories/${categoryId}`);
      res.status.should.be.eql(200);
      res.body.should.have.property('category_id');
      res.body.should.have.property('department_id');
      res.body.should.have.property('description');
      res.body.should.have.property('name');
      res.body.category_id.should.be.eql(categoryId);
    });

    it('should return error when category is not found', async () => {
      const res = await request.get('/api/categories/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('CAT_01');
      res.body.message.should.be.eql("Don't exist category with this ID");
    });
  });

  describe('GET /categories/inProduct/:productId', () => {
    let productId;

    before(async () => {
      const res = await request.get('/api/products');
      productId = res.body.rows[0].product_id;
    });

    it('should return categories for a specific product', async () => {
      const res = await request.get(`/api/categories/inProduct/${productId}`);
      res.status.should.be.eql(200);
      res.body[0].should.have.property('category_id');
      res.body[0].should.have.property('department_id');
      res.body[0].should.have.property('description');
      res.body[0].should.have.property('name');
    });

    it('should return error when product is not found', async () => {
      const res = await request.get('/api/categories/inProduct/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('PRO_01');
      res.body.message.should.be.eql("Don't exist product with this ID");
    });
  });

  describe('GET /categories/inDepartment/:departmentId', () => {
    let departmentId;

    before(async () => {
      const res = await request.get('/api/departments');
      departmentId = res.body[0].department_id;
    });

    it('should return categories for a specific department', async () => {
      const res = await request.get(`/api/categories/inDepartment/${departmentId}`);
      res.status.should.be.eql(200);
      res.body[0].should.have.property('category_id');
      res.body[0].should.have.property('department_id');
      res.body[0].should.have.property('description');
      res.body[0].should.have.property('name');
    });

    it('should return error when department is not found', async () => {
      const res = await request.get('/api/categories/inDepartment/0');
      res.status.should.be.eql(404);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(404);
      res.body.code.should.be.eql('DEP_01');
      res.body.message.should.be.eql("Don't exist department with this ID");
    });
  });
});
