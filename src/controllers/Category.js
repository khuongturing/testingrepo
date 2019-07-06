import models from '../../models/';
import { errorResponse } from '../utils/errors';

const { Category, Product, Department } = models

/**
 * @description: A class containing all the Category controllers
 *
 * @class: CategoryController
 *
 */
class CategoryController{

    /**
    * @description: This method get catgeories
    *
    * @method: getAllCategories
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing catgories
    */
    static getAllCategories = async(req, res, next) => {
        try {
            const categories = await Category.findAll()
            res.json(categories)
        } catch (err) {
            next()
        }
    }
    /**
     * @description: This method gets a category
     *
     * @method: getSIngleCategory
     *
     * @param {object} req: request parameter
     * @param {object} res: response object
     * @param {object} next: error response callback
     *
     * @return {object} response containing a category
     */
    static getSIngleCategory = async(req, res, next) => {
        try {
            const category = await Category.findByPk(req.params.category_id)
            if (!category) {
                return res.status(404).send(
                    errorResponse("CAT_01", 404,
                        "Don't exist category with this ID.",
                        "category_id")
                )
            }
            res.json(category)
        } catch (error) {
            next()
        }
    }

    /**
     * @description: This method gets catgory of a product
     *
     * @method: productCategory
     *
     * @param {object} req: request parameter
     * @param {object} res: response object
     * @param {object} next: error response callback
     *
     * @return {object} response containing category of a product
     */
    static productCategory = async(req, res, next) =>{
        const productCategoryList = []
        try {
            const { product_id } = req.params
            const productCategory = await Product.findOne({
                where: { product_id },
                include: [{
                    model: Category
                }]
            })
            if (!productCategory) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID..",
                        "product_id")
                )
            }
            productCategory.Categories.forEach(category => {
                const obj = {
                    category_id: category.category_id,
                    department_id: category.department_id,
                    name: category.name
                }
                productCategoryList.push(obj)
            })
            res.json(productCategoryList)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets all departments
    *
    * @method: departmentCategory
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {object} next: error response callback
    *
    * @return {object} response containing department of a category
    */
    static departmentCategory = async(req, res, next) => {
        try {
            const { department_id } = req.params
            const departmentCategory = await Department.findAll({
                where: { department_id },
                include: [{
                    model: Category
                }]
            })
            const { Categories } = departmentCategory[0]
            res.json(Categories)
        } catch (err) {
            next()
        }
    }
}
export default CategoryController;
