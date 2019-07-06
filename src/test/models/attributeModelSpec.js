import 'babel-polyfill';
import chai from 'chai';
import model from '../../../models';

const { Attribute } = model;

const should = chai.should();
describe('Shopify database', () => {
    before((done) => {
        Attribute.destroy({
            where: {},
            truncate: true
        })
        done()
    });
    describe('Attribute Model', () => {
        it('should create a single record', async () => {
            const attribute = await Attribute.create({
                name: 'LG, RED'
            });
            attribute.should.be.a('object');
            attribute.should.have.property('dataValues');
            attribute.dataValues.name.should.be.eql('LG, RED');
        });

        it('should create bulk records', async () => {
            const attributes = await Attribute.bulkCreate([
                { name: 'LG, Blue' },
                { name: 'LG, Black' },
                { name: 'LG, White' },
            ]);
            attributes.should.be.a('array');
        });

        it('should fetch a particular record', async () => {
            const attribute = await Attribute.findOne({ where: { name: 'LG, RED' } });
            attribute.should.be.a('object');
            attribute.should.have.property('dataValues');
            attribute.dataValues.name.should.be.eql('LG, RED');
        });

        it('should fetch all records', async () => {
            const attribute = await Attribute.findAll();
            attribute.should.be.a('array');
            attribute.length.should.be.above(1);
            attribute[1].should.have.property('dataValues');
        });

        it('should update a particular record and return the record', async () => {
            const updatedAttribute = await Attribute.update(
                { name: 'Updated!'},
                { where: { attribute_id: 1 } }
            );
            updatedAttribute.should.be.a('array');
        });

        it('should delete a particular record', async () => {
            await Attribute.destroy({
                where: { name: 'LG, White' } });
            const deletedAttribute = await Attribute.findOne({
                where: { name: 'LG, White' } });
            should.not.exist(deletedAttribute);
        });
    })
})
