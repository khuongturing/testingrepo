import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import app from '../index';

chai.use(chaiHttp);

describe('Shipping Regions', () => {
  it('Should get all shipping regions', (done) => {
    chai.request(app)
      .get('/shipping/regions')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].shipping_region).to.include('Please Select');
        done();
      });
  });

  it('Should get shipping for a shipping region', (done) => {
    chai.request(app)
      .get('/shipping/regions/3')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].shipping_id).to.equal(4);
        done();
      });
  });
});
