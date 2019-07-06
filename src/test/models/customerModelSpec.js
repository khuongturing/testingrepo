import 'babel-polyfill';
import chai from 'chai';
import model from '../../../models';

const { Customer } = model;
const should = chai.should();

describe('Shopify database', () => {
    before((done) => {
        Customer.destroy({
            where: {},
            truncate: true
        })
        done()
    });

    describe('Customer Model', () => {
        it('should create a single record', async () => {
            const customer = await Customer.create({
                name: 'John Doe',
                email: 'john.doe@email.com',
                password: 'test',
                credit_card: '12345789',
                address_1: 'Lagos,Nigeria',
                address_2: 'Ajao Estate',
                city: 'Lagos',
                region: 'South',
                postal_code: '554545',
                country: 'Nigeria',
                shipping_region_id: 2,
                day_phone: '08032323232',
                eve_phone: '08032323232',
                mob_phone: '08032323232'
            });
            customer.should.be.a('object');
            customer.should.have.property('dataValues');
            customer.dataValues.name.should.be.eql('John Doe');
            customer.dataValues.email.should.be.eql('john.doe@email.com');
            customer.dataValues.password.should.be.eql('test');
            customer.dataValues.credit_card.should.be.eql('12345789');
            customer.dataValues.address_1.should.be.eql('Lagos,Nigeria');
            customer.dataValues.address_2.should.be.eql('Ajao Estate');
            customer.dataValues.city.should.be.eql('Lagos');
            customer.dataValues.region.should.be.eql('South');
            customer.dataValues.postal_code.should.be.eql('554545');
            customer.dataValues.country.should.be.eql('Nigeria');
            customer.dataValues.shipping_region_id.should.be.eql(2);
            customer.dataValues.day_phone.should.be.eql('08032323232');
            customer.dataValues.eve_phone.should.be.eql('08032323232');
            customer.dataValues.mob_phone.should.be.eql('08032323232');
        });

        it('should create bulk records', async () => {
            const customers = await Customer.bulkCreate([
                {
                    name: 'Jane Doe',
                    email: 'Jane.doe@email.com',
                    password: 'test',
                    credit_card: '12345789',
                    address_1: 'Abuja,Nigeria',
                    address_2: 'Kado Estate',
                    city: 'Abuja',
                    region: 'North',
                    postal_code: '554545',
                    country: 'Nigeria',
                    shipping_region_id: 3,
                    day_phone: '08032323442',
                    eve_phone: '08032323442',
                    mob_phone: '08032323442'
                },
                {
                    name: 'Malcom Y',
                    email: 'malcom.y@email.com',
                    password: 'test',
                    credit_card: '12345789',
                    address_1: 'Cahuenga Boulevard',
                    address_2: 'Los Angeles',
                    city: 'Los Angeles',
                    region: 'South',
                    postal_code: '554545',
                    country: 'America',
                    shipping_region_id: 5,
                    day_phone: '08032323232',
                    eve_phone: '08032323232',
                    mob_phone: '08032323232'
                }
            ]);
            customers.should.be.a('array');
        });

        it('should fetch a particular record', async () => {
            const customer = await Customer.findOne({ where: { name: 'Malcom Y' } });
            customer.should.be.a('object');
            customer.should.have.property('dataValues');
            customer.dataValues.email.should.be.eql('malcom.y@email.com');
            customer.dataValues.password.should.be.eql('test');
            customer.dataValues.credit_card.should.be.eql('12345789');
            customer.dataValues.address_1.should.be.eql('Cahuenga Boulevard');
            customer.dataValues.address_2.should.be.eql('Los Angeles');
            customer.dataValues.city.should.be.eql('Los Angeles');
            customer.dataValues.region.should.be.eql('South');
            customer.dataValues.postal_code.should.be.eql('554545');
            customer.dataValues.country.should.be.eql('America');
            customer.dataValues.shipping_region_id.should.be.eql(5);
            customer.dataValues.day_phone.should.be.eql('08032323232');
            customer.dataValues.eve_phone.should.be.eql('08032323232');
            customer.dataValues.mob_phone.should.be.eql('08032323232');
        });
    })
})