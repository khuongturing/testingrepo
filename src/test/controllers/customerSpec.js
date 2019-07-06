
import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import model from '../../../models'

chai.use(chaiHttp);
const { Customer } = model;
const should = chai.should();
const validCustomer = {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "password": "qwertyuiop"
};
let testCustomer;

describe('Shopify API', () => {
    describe('POST /customers Customers Sign Up', () => {
        beforeEach((done) => {
            testCustomer = Object.assign({}, validCustomer);
            done()
        });
        it('should return an error for missing name', (done) => {
            testCustomer.name = '';
            chai.request(app).post('/customers').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The field(s) are/is required');
                    res.body.field.should.be.eql('name')
                    done();
                });
        });

        it('should return an error for missing email address', (done) => {
            testCustomer.email = '';
            chai.request(app).post('/customers').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The field(s) are/is required');
                    res.body.field.should.be.eql('email')
                    done();
                });
        });

        it('should return an error for missing password', (done) => {
            testCustomer.password = '';
            chai.request(app).post('/customers').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The field(s) are/is required');
                    res.body.field.should.be.eql('password')
                    done();
                });
        });

        it('should return an error for invalid password', (done) => {
            testCustomer.email = 'invalidEmail';
            chai.request(app).post('/customers').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The email is invalid');
                    res.body.field.should.be.eql('email')
                    done();
                });
        });

        it('should return an error message if email already exists', (done) => {
            testCustomer.name = 'West';
            testCustomer.email = 'john.doe@email.com';
            chai.request(app).post('/customers').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_04')
                    res.body.status.should.be.eql(409)
                    res.body.message.trim().should.be.eql('The email already exists.');
                    res.body.field.should.be.eql('email')
                    done();
                });
        });

        it('should create a new customer', (done) => {
            Customer.destroy({
                where: {},
                truncate: true
            })
            chai.request(app).post('/customers').send(validCustomer)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.customer.should.have.property('shipping_region_id');
                    res.body.customer.should.have.property('customer_id');
                    res.body.customer.should.have.property('name');
                    res.body.customer.should.have.property('email');
                    res.body.customer.should.have.property('password');
                    res.body.should.have.property('accessToken');
                    res.body.customer.name.trim().should.be.eql('John Doe');
                    res.body.customer.email.should.be.eql('john.doe@email.com')
                    done();
                });
        });

    })

    describe('POST /customers Customers Sign In', () => {
        beforeEach(() => {
            testCustomer = Object.assign({}, validCustomer);
        });

        it('should return an error for missing name', (done) => {
            testCustomer.name = '';
            chai.request(app).post('/customers/login').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The field(s) are/is required');
                    res.body.field.should.be.eql('name')
                    done();
                });
        });
        it('should return an error for missing name', (done) => {
            testCustomer.password = '';
            chai.request(app).post('/customers/login').send(testCustomer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.code.should.be.eql('USR_03')
                    res.body.status.should.be.eql(400)
                    res.body.message.trim().should.be.eql('The field(s) are/is required');
                    res.body.field.should.be.eql('password')
                    done();
                });
        });
        it('should return an error for missing name', (done) => {
            chai.request(app).post('/customers/login').send(testCustomer)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.customer.should.have.property('shipping_region_id');
                    res.body.customer.should.have.property('customer_id');
                    res.body.customer.should.have.property('name');
                    res.body.customer.should.have.property('email');
                    res.body.customer.should.have.property('password');
                    res.body.should.have.property('accessToken');
                    res.body.customer.name.trim().should.be.eql('John Doe');
                    res.body.customer.email.should.be.eql('john.doe@email.com')
                    done();
                });
        });
    });
});
