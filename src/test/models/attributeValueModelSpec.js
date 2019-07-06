import 'babel-polyfill';
import chai from 'chai';
import model from '../../../models';

const { AttributeValue, Attribute } = model;
const should = chai.should();

describe('Shopify database', () => {
    before(function (done) {
        AttributeValue.destroy({
            where: {},
            truncate: true
        }),
        Attribute.destroy({
            where: {},
            truncate: true
        })
        done()
    });
    describe('AttributeValue Model', () => {
        it('should create a single record', async () => {
            const attribute = await Attribute.create({
                name: 'LG, RED'
            });
            const attributeValue = await AttributeValue.create({
                attribute_id: attribute.attribute_id,
                value: 'S'
            })
            attributeValue.should.be.a('object');
            attributeValue.should.have.property('dataValues');
            attributeValue.dataValues.attribute_id.should.be.eql(1);
            attributeValue.dataValues.value.should.be.eql('S');
        })

        it('should create bulk records', async () => {
            const attributeValue = await AttributeValue.bulkCreate([
                {
                    attribute_id: 2,
                    value: 'M'
                },
                {
                    attribute_id: 3,
                    value: 'XXL'
                },
                {
                    attribute_id: 4,
                    value: 'XL'
                }
            ]);
            attributeValue.should.be.a('array');
        });

        it('should fetch a particular record', async () => {
            const attributeValue = await AttributeValue.findOne({ where: { attribute_id: 2 } });
            attributeValue.should.be.a('object');
            attributeValue.should.have.property('dataValues');
            attributeValue.dataValues.value.should.be.eql('M');
        });

        it('should fetch all records', async () => {
            const attributeValue = await AttributeValue.findAll();
            attributeValue.should.be.a('array');
            attributeValue.length.should.be.eql(4);
            attributeValue[1].should.have.property('dataValues');
        });

        it('should update a particular record and return the record', async () => {
            const updatedAttributeValue = await AttributeValue.update(
                { value: 'Orange' },
                { where: { attribute_id: 1 } }
            );
            updatedAttributeValue.should.be.a('array');
        });

        it('should delete a particular record', async () => {
            await AttributeValue.destroy({
                where: { attribute_id: 3 }
            });
            const deletedAttributeValue = await AttributeValue.findOne({
                where: { attribute_id: 3 }
            });
            should.not.exist(deletedAttributeValue);
        });
    })
})