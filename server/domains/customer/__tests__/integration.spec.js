import app from 'src/app';
import { describe, it } from 'mocha';
import chai from 'chai';
import supertest from 'supertest';
import faker from 'faker';

const request = supertest(app);

chai.should();

describe('Customer Module', () => {
  describe('POST /customers', () => {
    let registeredEmail;
    it('should register a customer', (done) => {
      request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        })
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.customer.should.be.a('object');
          res.body.customer.should.have.property('schema');
          res.body.customer.schema.should.have.property('customer_id');
          res.body.customer.schema.should.have.property('name');
          res.body.customer.schema.should.have.property('email');
          res.body.customer.schema.should.have.property('credit_card');
          res.body.customer.schema.should.have.property('address_1');
          res.body.customer.schema.should.have.property('address_2');
          res.body.customer.schema.should.have.property('city');
          res.body.customer.schema.should.have.property('region');
          res.body.customer.schema.should.have.property('postal_code');
          res.body.customer.schema.should.have.property('country');
          res.body.customer.schema.should.have.property('shipping_region_id');
          res.body.customer.schema.should.have.property('day_phone');
          res.body.customer.schema.should.have.property('eve_phone');
          res.body.customer.schema.should.have.property('mob_phone');
          res.body.customer.schema.name.should.be.eql('John Samuel');
          registeredEmail = res.body.customer.schema.email;
          done(err);
        });
    });

    it('should return error on registering with existing email', (done) => {
      request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: registeredEmail,
          password: 'secretpass',
        })
        .end((err, res) => {
          res.status.should.be.eql(409);
          res.body.should.have.property('status');
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.status.should.be.eql(409);
          res.body.code.should.be.eql('USR_04');
          res.body.message.should.be.eql('The email already exists');
          done();
        });
    });

    it('should return error when input fails validation', async () => {
      // The email field is required
      let res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          password: 'secretpass',
        });

      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_02');
      res.body.message.should.be.eql('The email field is required');

      // The password field is required
      res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_02');
      res.body.message.should.be.eql('The password field is required');

      // The name field is required
      res = await request.post('/api/customers')
        .send({
          email: faker.internet.email(),
          password: 'secretpass',
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The name field is required');

      // The email field is invalid
      res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: 'johndoe',
          password: 'secretpass',
        });

      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_03');
      res.body.message.should.be.eql('The email field is invalid');
    });
  });

  describe('POST /customers/login', () => {
    let registeredEmail;
    before(async () => {
      const res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      registeredEmail = res.body.customer.schema.email;
    });

    it('should login a customer', async () => {
      const res = await request.post('/api/customers/login')
        .send({
          email: registeredEmail,
          password: 'secretpass'
        });

      res.status.should.be.eql(200);
      res.body.customer.should.be.a('object');
      res.body.customer.should.have.property('schema');
      res.body.customer.schema.should.have.property('customer_id');
      res.body.customer.schema.should.have.property('name');
      res.body.customer.schema.should.have.property('email');
      res.body.customer.schema.should.have.property('credit_card');
      res.body.customer.schema.should.have.property('address_1');
      res.body.customer.schema.should.have.property('address_2');
      res.body.customer.schema.should.have.property('city');
      res.body.customer.schema.should.have.property('region');
      res.body.customer.schema.should.have.property('postal_code');
      res.body.customer.schema.should.have.property('country');
      res.body.customer.schema.should.have.property('shipping_region_id');
      res.body.customer.schema.should.have.property('day_phone');
      res.body.customer.schema.should.have.property('eve_phone');
      res.body.customer.schema.should.have.property('mob_phone');
      res.body.customer.schema.name.should.be.eql('John Samuel');
      registeredEmail = res.body.customer.schema.email;
    });

    it('should return error on logging in with invalid email', async () => {
      const res = await request.post('/api/customers/login')
        .send({
          email: 'nonexistingemail@site.test',
          password: 'secretpass',
        });
      res.status.should.be.eql(401);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(401);
      res.body.code.should.be.eql('USR_05');
      res.body.message.should.be.eql("The email doesn't exist");
    });

    it('should return error when input fails validation', async () => {
      // The email field is invalid
      let res = await request.post('/api/customers/login')
        .send({
          email: 'JohnSamuel',
          password: 'secretpass',
        });

      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_03');
      res.body.message.should.be.eql('The email field is invalid');

      // The email field is required
      res = await request.post('/api/customers/login')
        .send({
          password: 'JohnSamuel',
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_02');
      res.body.message.should.be.eql('The email field is required');

      // The password field is required
      res = await request.post('/api/customers/login')
        .send({
          email: registeredEmail,
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_02');
      res.body.message.should.be.eql('The password field is required');

      // The password field is empty
      res = await request.post('/api/customers/login')
        .send({
          email: registeredEmail,
          password: '',
        });

      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_03');
      res.body.message.should.be.eql('The password field is empty');
    });
  });

  describe('PUT /customers', () => {
    let registeredEmail;
    let otherUserEmail;
    let userToken;

    before(async () => {
      let res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      registeredEmail = res.body.customer.schema.email;
      userToken = res.body.accessToken;

      res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      otherUserEmail = res.body.customer.schema.email;
    });

    it('should update customer details', async () => {
      const res = await request.put('/api/customer')
        .set('USER-KEY', userToken)
        .send({
          name: 'new name',
          email: `rockie${registeredEmail}`,
          day_phone: '08123232323',
          eve_phone: '08123232323',
          mob_phone: '08123232323',
        });

      res.status.should.be.eql(200);
      res.body.should.have.property('customer_id');
      res.body.should.have.property('name');
      res.body.should.have.property('email');
      res.body.should.have.property('credit_card');
      res.body.should.have.property('address_1');
      res.body.should.have.property('address_2');
      res.body.should.have.property('city');
      res.body.should.have.property('region');
      res.body.should.have.property('postal_code');
      res.body.should.have.property('country');
      res.body.should.have.property('shipping_region_id');
      res.body.should.have.property('day_phone');
      res.body.should.have.property('eve_phone');
      res.body.should.have.property('mob_phone');
      res.body.day_phone.should.be.eql('08123232323');
      res.body.eve_phone.should.be.eql('08123232323');
      res.body.mob_phone.should.be.eql('08123232323');
      res.body.name.should.be.eql('new name');
    });

    it('should fail to update when email provided already exists for another user', async () => {
      const res = await request.put('/api/customer')
        .set('USER-KEY', userToken)
        .send({
          name: 'new name',
          email: otherUserEmail,
          day_phone: '08123232323',
          eve_phone: '08123232323',
          mob_phone: '08123232323',
        });
      res.status.should.be.eql(409);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(409);
      res.body.code.should.be.eql('USR_04');
      res.body.message.should.be.eql('The email already exists');
    });

    it('should return error when input fails validation', async () => {
      // The name field is required
      let res = await request.put('/api/customer')
        .set('USER-KEY', userToken)
        .send({
          email: 'newemail@g.com',
          day_phone: '08123232323',
          eve_phone: '08123232323',
          mob_phone: '08123232323',
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The name field is required');

      // max length exceeded
      res = await request.put('/api/customer')
        .set('USER-KEY', userToken)
        .send({
          name: 'newedontuesdythisistheendofsolomongandigasdsdsdsdasdasdaasdasdasddsdsdsdsd@g.comname',
          day_phone: '08123232323',
          eve_phone: '08123232323',
          mob_phone: '08123232323',
          email: 'newemail@g.com',
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The name field is longer than 60 in character length');

      // min length not supplied
      res = await request.put('/api/customer')
        .set('USER-KEY', userToken)
        .send({
          name: 'new',
          day_phone: '08123232323',
          eve_phone: '08123232323',
          mob_phone: '08123232323',
          email: 'newemail@g.com',
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The name field is less than 8 in character length');
    });
  });

  describe('PUT /customers/address', () => {
    let userToken;
    const wrongToken = 'Bearer gaksdgfhkasdfghkasgdhfgkashdfgkashdjfgkashdfgkahsdgkfahsdfgkahsdgfkhasdfgkhasdkfhasd';
    const addressUpdateData = {
      address_2: '20, Aminu Street, Ikeja, Lagos',
      city: 'Ikeja',
      region: 'Lagos',
      postal_code: '100001',
      country: 'Canada',
      shipping_region_id: '1',
    };

    before(async () => {
      const res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      userToken = res.body.accessToken;
    });

    it('should update the address of the customer', async () => {
      const res = await request.put('/api/customers/address')
        .set('USER-KEY', userToken)
        .send({
          address_1: '5, Broad Street, Victoria Island',
          address_2: '20, Aminu Street, Ikeja, Lagos',
          city: 'Ikeja',
          region: 'Lagos',
          postal_code: '100001',
          country: 'Canada',
          shipping_region_id: '1',
        });

      res.status.should.be.eql(200);
      res.body.should.have.property('customer_id');
      res.body.should.have.property('name');
      res.body.should.have.property('email');
      res.body.should.have.property('credit_card');
      res.body.should.have.property('address_1');
      res.body.should.have.property('address_2');
      res.body.should.have.property('city');
      res.body.should.have.property('region');
      res.body.should.have.property('postal_code');
      res.body.should.have.property('country');
      res.body.should.have.property('shipping_region_id');
      res.body.should.have.property('day_phone');
      res.body.should.have.property('eve_phone');
      res.body.should.have.property('mob_phone');
      res.body.address_1.should.be.eql('5, Broad Street, Victoria Island');
      res.body.address_2.should.be.eql('20, Aminu Street, Ikeja, Lagos');
      res.body.city.should.be.eql('Ikeja');
      res.body.region.should.be.eql('Lagos');
    });

    it('should fail when wrong token is supplied', async () => {
      const res = await request.put('/api/customers/address')
        .set('USER-KEY', wrongToken)
        .send(addressUpdateData);

      res.status.should.be.eql(403);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(403);
      res.body.code.should.be.eql('AUT_02');
      res.body.message.should.be.eql('Access Unauthorized');
    });

    it('should return error when input fails validation', async () => {
      // The address_1 field is required
      const res = await request.put('/api/customers/address')
        .set('USER-KEY', userToken)
        .send({
          ...addressUpdateData,
          address_1: undefined,
        });
      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The address_1 field is required');
    });
  });

  describe('PUT /customers/creditCard', () => {
    let userToken;
    const wrongToken = 'Bearer gaksdgfhkasdfghkasgdhfgkashdfgkashdjfgkashdfgkahsdgkfahsdfgkahsdgfkhasdfgkhasdkfhasd';
    const updateData = {
      credit_card: '10212122'
    };

    before(async () => {
      const res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      userToken = res.body.accessToken;
    });

    it('should update the credit card of the customer', async () => {
      const res = await request.put('/api/customers/creditCard')
        .set('USER-KEY', userToken)
        .send(updateData);

      res.status.should.be.eql(200);
      res.body.should.have.property('customer_id');
      res.body.should.have.property('name');
      res.body.should.have.property('email');
      res.body.should.have.property('credit_card');
      res.body.should.have.property('address_1');
      res.body.should.have.property('address_2');
      res.body.should.have.property('city');
      res.body.should.have.property('region');
      res.body.should.have.property('postal_code');
      res.body.should.have.property('country');
      res.body.should.have.property('shipping_region_id');
      res.body.should.have.property('day_phone');
      res.body.should.have.property('eve_phone');
      res.body.should.have.property('mob_phone');
      res.body.credit_card.should.be.eql(updateData.credit_card);
    });

    it('should fail when wrong token is supplied', async () => {
      const res = await request.put('/api/customers/creditCard')
        .set('USER-KEY', wrongToken)
        .send(updateData);

      res.status.should.be.eql(403);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(403);
      res.body.code.should.be.eql('AUT_02');
      res.body.message.should.be.eql('Access Unauthorized');
    });

    it('should return error when input fails validation', async () => {
      // The credit_card field is required
      const res = await request.put('/api/customers/creditCard')
        .set('USER-KEY', userToken)
        .send({});

      res.status.should.be.eql(422);
      res.body.should.have.property('status');
      res.body.should.have.property('code');
      res.body.should.have.property('message');
      res.body.status.should.be.eql(422);
      res.body.code.should.be.eql('USR_00');
      res.body.message.should.be.eql('The credit_card field is required');
    });
  });

  describe('GET /customer', () => {
    let userToken;

    before(async () => {
      const res = await request.post('/api/customers')
        .send({
          name: 'John Samuel',
          email: faker.internet.email(),
          password: 'secretpass',
        });
      userToken = res.body.accessToken;
    });

    it('should return a single customer', async () => {
      request.get('/api/customer')
        .set('USER-KEY', userToken)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.have.property('customer_id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('credit_card');
          res.body.should.have.property('address_1');
          res.body.should.have.property('address_2');
          res.body.should.have.property('city');
          res.body.should.have.property('region');
          res.body.should.have.property('postal_code');
          res.body.should.have.property('country');
          res.body.should.have.property('shipping_region_id');
          res.body.should.have.property('day_phone');
          res.body.should.have.property('eve_phone');
          res.body.should.have.property('mob_phone');
          res.body.name.should.be.eql('John Samuel');
        });
    });
  });
});
