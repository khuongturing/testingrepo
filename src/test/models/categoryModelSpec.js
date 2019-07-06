import 'babel-polyfill';
import chai from 'chai';
import models from '../../../models';

const { Category, Department } = models;
const should = chai.should();

describe('Shopify database', () => {
    before((done) => {
        Category.destroy({
            where: {},
            truncate: true
        }),
        Department.destroy({
            where: {},
            truncate: true
        })
        done()
    })

    describe('Category Model', () => {
        it('should create a single record', async () => {
            const department = await Department.create({
                name: 'Regional'
            });
            const category = await Category.create({
                department_id: department.department_id,
                name: 'French',
                description: 'This is a test!'
            });
            category.should.be.a('object');
            category.should.have.property('dataValues');
            category.dataValues.name.should.be.eql('French');
            category.dataValues.description.should.be.eql('This is a test!');
        });

        it('should create bulk records', async () => {
            const categories = await Category.bulkCreate([
                { department_id: 2, name: 'Italian', description: 'Test 2'},
                { department_id: 3, name: 'Irish', description: 'Test 3' },
                { department_id: 4, name: 'Animal', description: 'Test 4' }
            ]);
            categories.should.be.a('array');
        });

        it('should fetch a particular record', async () => {
            const category = await Category.findOne({ where: { department_id: 2 } });
            category.should.be.a('object');
            category.should.have.property('dataValues');
            category.dataValues.name.should.be.eql('Italian');
            category.dataValues.description.should.be.eql('Test 2');
        });

        it('should fetch all records', async () => {
            const categories = await Category.findAll();
            categories.should.be.a('array');
            categories.length.should.be.above(1);
            categories[1].should.have.property('dataValues');
        });

        it('should update a particular record and return the record', async () => {
            const category = await Category.update(
                { name: 'Updated!' },
                { where: { department_id: 1 } }
            );
            category.should.be.a('array');
        });

        it('should delete a particular record', async () => {
            await Category.destroy({
                where: { department_id: 2 }
            });
            const deletedCategory = await Category.findOne({
                where: { department_id: 2 }
            });
            should.not.exist(deletedCategory);
        });
    })
})