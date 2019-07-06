import Sequelize from 'sequelize';
import models from '../../models/';
import { errorResponse } from '../utils/errors';
import { 
    paginate, alterDescriptionField, 
    checkEmpty 
} from '../utils/helpers'

const { Product, Category, Review } = models;
const Op = Sequelize.Op;

/**
 * @description: A class containing all the Product controllers
 *
 * @class: ProductController
 *
 */
class ProductController {
    /**
     * @description: This method gets all existing products
     *
     * @method: getAllProducts
     *
     * @param {object} req: request parameter
     * @param {object} res: response object
     * @param {object} next: error response callback
     *
     * @return {object} response containing the products
     */
    static getAllProducts = async (req, res, next) => {
        const { page, limit, description_length } = req.query;
        try {
            if (!page || !limit || !description_length) {

                const products = await Product.findAndCountAll({
                    attributes: ['product_id', 'name', 'description',
                        'price', 'discounted_price', 'thumbnail']
                })
                alterDescriptionField(products, description_length)
                return res.json(products)
            }
            const products = await Product.findAndCountAll({
                ...paginate({ page, limit }),
                attributes: ['product_id', 'name', 'description',
                    'price', 'discounted_price', 'thumbnail']
            })
            alterDescriptionField(products, description_length)
            res.json(products)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets all existing products through search
    *
    * @method: productSearch
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing the searched products
    */
    static searchProduct = async (req, res, next) => {
        const { page, limit, description_length, query_string } = req.query;
        try {
            if (!query_string) {
                return res.status(400).json(
                    errorResponse("CAT_02", 400,
                        "Query String is required", "query_string")
                )
            }
            const products = await Product.findAndCountAll({
                ...paginate({ page, limit }),
                where: {
                    [Op.or]: [{ name: { [Op.like]: '%' + query_string + '%' } },
                    {
                        description: { [Op.like]: '%' + query_string + '%' }
                    }]
                },
                attributes: ['product_id', 'name', 'description',
                    'price', 'discounted_price', 'thumbnail']
            })
            alterDescriptionField(products, description_length)
            res.json(products)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets a products
    *
    * @method: getSingleProduct
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing product
    */
    static getSingleProduct = async (req, res, next) => {
        try {
            const product = await Product.findByPk(req.params.product_id)
            if (!product) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID..",
                        "product_id")
                )
            }
            res.json(product)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets products that belongs to a category.
    *
    * @method: categoryOfProduct
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing products.
    */
    static categoryOfProduct = async (req, res, next) => {
        try {
            const { category_id } = req.params
            const { page, limit, description_length } = req.query;
            if (!category_id) {
                return res.status(400).json(
                    errorResponse("CAT_02", 400,
                        "The field(s) are/is required", "category Id")
                )
            }
            const category = await Category.findOne({
                where: { category_id }
            })
            if (!category) {
                return res.status(400).json(
                    errorResponse("CAT_01", 404,
                        "Don't exist category with this ID.", "category Id")
                )
            }
            if (page && limit && description_length) {
                const categoryOfProduct = await Category.findAndCountAll({
                    ...paginate({ page, limit }),
                    where: { category_id },
                    attributes: { exclude: ['category_id', 'department_id', 'name', 'description'] },
                    include: [{
                        model: Product,
                        attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
                        through: { attributes: [] }
                    }],
                })
                if (categoryOfProduct.rows === undefined || categoryOfProduct.rows.length == 0) {
                    return res.json(categoryOfProduct)
                } else {
                    categoryOfProduct['rows'] = categoryOfProduct.rows[0].Products
                    alterDescriptionField(categoryOfProduct, description_length)
                    return res.json(categoryOfProduct)
                }
            }
            const categoryOfProduct = await Category.findAndCountAll({
                where: { category_id },
                attributes: { exclude: ['category_id', 'department_id', 'name', 'description'] },
                include: [{
                    model: Product,
                    attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
                    through: { attributes: [] }
                }],
            })
            categoryOfProduct['rows'] = categoryOfProduct.rows[0].Products
            alterDescriptionField(categoryOfProduct, description_length)
            return res.json(categoryOfProduct)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets products that belongs to a department.
    *
    * @method: productDepartment
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing products.
    */
    static productDepartment = async (req, res, next) => {
        const { page, limit, description_length } = req.query;
        try {
            const { department_id } = req.params
            const productDepartment = await Category.findAndCountAll({
                ...paginate({ page, limit }),
                where: { department_id: department_id },
                attributes: { exclude: ['category_id', 'department_id', 'name', 'description'] },
                include: [{
                    model: Product,
                    attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
                    through: { attributes: [] }
                }],
            })
            productDepartment['rows'] = productDepartment.rows[0].Products
            alterDescriptionField(productDepartment, description_length)
            res.json(productDepartment)
        } catch (err) {
            next()
        }
    }
    /**
    * @description: This method gets the detail of a product.
    *
    * @method: productDetail
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing product detail.
    */
    static productDetail = async (req, res, next) => {
        const result = []
        try {
            const { product_id } = req.params
            const productDetail = await Product.findOne({
                where: { product_id: product_id },
                attributes: {
                    exclude: ['thumbnail', 'display']
                }
            })
            if (!productDetail) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID.",
                        "product_id")
                )
            }
            result.push(productDetail)
            res.json(result)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This method gets the reviews of a product.
    *
    * @method: productReviews
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing product reviews by a customer.
    */
    static productReviews = async (req, res, next) => {
        const customerReviews = []
        try {
            const { product_id } = req.params
            const { name } = req.user
            if (product_id <= 0 || !product_id) {
                return res.status(400).json(
                    errorResponse("PRO_03", 400,
                        "Invalid product Id",
                        "product Id")
                )
            }
            const reviews = await Product.findOne({
                where: { product_id },
                attributes: {
                    exclude: ['product_id', 'name', 'description', 'price',
                        'discounted_price', 'thumbnail', 'image',
                        'image_2', 'display']
                },
                include: [{
                    model: Review
                }]
            })
            reviews.Reviews.forEach(data => {
                const { review, rating, created_on } = data
                const obj = { name, review, rating, created_on }
                customerReviews.push(obj)
            });
            res.json(customerReviews)
        } catch (err) {
            next()
        }
    }

    /**
    * @description: This is a post method. This ensures customers are able to
    * give their review about a product.
    *
    * @method: postReview
    *
    * @param {object} req: request parameter
    * @param {object} res: response object
    * @param {function} next: error response callback
    *
    * @return {object} response containing product reviews given by a customer.
    */
    static postReview = async (req, res, next) => {
        try {
            const { customerId } = req.user
            const { product_id } = req.params
            const { review, rating } = req.body
            const error = checkEmpty([
                { review },
                { rating }])
            if (error) {
                return res.status(400).json(
                    errorResponse("PRO_04", 400, error.message, error.name)
                )
            }
            const created_on = new Date()
            const newReview = review.trim()
            if (!product_id) {
                return res.status(400).json(
                    errorResponse("PRO_02", 400,
                        "The field(s) are/is required",
                        "product Id"))
            }
            const product = await Product.findByPk(product_id)
            if (!product) {
                return res.status(404).send(
                    errorResponse("PRO_01", 404,
                        "Don't exist product with this ID..",
                        "product_id")
                )
            }
            const customerReview = await Review.create({
                customer_id: customerId,
                product_id,
                review: newReview,
                rating,
                created_on
            })
            res.json(customerReview)
        } catch (err) {
            next();
        }
    }
}

export default ProductController;
