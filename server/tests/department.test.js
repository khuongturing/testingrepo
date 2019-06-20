import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);

describe('Departments', () => {
  it('Should get all departments', (done) => {
    chai.request(app)
      .get('/departments')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(3);
        expect(res.body[0].name).to.be.equal('Regional');
        done();
      });
  });

  it('Should get a single department', (done) => {
    chai.request(app)
      .get('/departments/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Regional');
        done();
      });
  });

  it('Should show 404 if no department with given id', (done) => {
    chai.request(app)
      .get('/departments/10')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error.message).to.equal('Department cannot be found');
        done();
      });
  });

  it('Should show 400 if department id is not a number', (done) => {
    chai.request(app)
      .get('/departments/1nn')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.message).to.equal('The ID is not a number.');
        done();
      });
  });
});
