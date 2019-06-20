import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';

const request = supertest(app);

chai.should();

describe('Department Module', () => {
  describe('GET /departments', () => {
    it('should return all departments', async () => {
      const res = await request.get('/api/departments');
      res.status.should.be.eql(200);
      res.body[0].should.have.property('department_id');
      res.body[0].should.have.property('description');
      res.body[0].should.have.property('name');
    });
  });

  describe('GET /departments/:departmentId', () => {
    let departmentId;
    before(async () => {
      const res = await request.get('/api/departments');
      departmentId = res.body[0].department_id;
    });

    it('should return a specific department', async () => {
      const res = await request.get(`/api/departments/${departmentId}`);
      res.status.should.be.eql(200);
      res.body.should.have.property('department_id');
      res.body.should.have.property('description');
      res.body.should.have.property('name');
      res.body.department_id.should.be.eql(departmentId);
    });

    it('should return error when department is not found', async () => {
      const res = await request.get('/api/departments/0');
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
