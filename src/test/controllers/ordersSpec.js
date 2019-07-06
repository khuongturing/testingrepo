
import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';

chai.use(chaiHttp);
chai.should();
const validCustomer = {
    "email": "john.doe@email.com",
    "password": "qwertyuiop"
};
let testCustomer,token;

describe('Shopify API', () => {
    describe('POST /orders Customer Orders', () => {
        beforeEach((done) => {
            testCustomer = Object.assign({}, validCustomer);
            chai.request(app).post('/customers/login').send(testCustomer)
                .end((err, res) => {
                    token = res.body.accessToken;
                    done();
                });
        });
        it('should require an access token before creating an order', (done) => {
            const order = {
                cart_id: 2,
                shipping_id: 3,
                tax_id: 3
            }
            chai.request(app).post('/orders').send(order)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('AUT_01')
                    res.body.message.trim().should.be.eql('Authorization code is empty');
                    res.body.field.should.be.eql('NoAuth')
                    done();
                })
        })
        it('should require an access token before creating an order', (done) => {
            const order = {
                cart_id: 2,
                shipping_id: 3,
                tax_id: 3
            }
            chai.request(app).post('/orders')
                .set('x-access-token', token)
                .send(order)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('orderId');
                    done();
                })
        })
    })
});
