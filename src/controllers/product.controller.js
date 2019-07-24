/**
 * The Product controller contains all static methods that handles product request
 * Some methods work fine, some needs to be implemented from scratch while others may contain one or two bugs
 * The static methods and their function include:
 * 
 * - getAllProducts - Return a paginated list of products
 * - searchProducts - Returns a list of product that matches the search query string
 * - getProductsByCategory - Returns all products in a product category
 * - getProductsByDepartment - Returns a list of products in a particular department
 * - getProduct - Returns a single product with a matched id in the request params
 * - getAllDepartments - Returns a list of all product departments
 * - getDepartment - Returns a single department
 * - getAllCategories - Returns all categories
 * - getSingleCategory - Returns a single category
 * - getDepartmentCategories - Returns all categories in a department
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import { Product, ProductCategory, Department, Review, Customer, Category, Sequelize } from '../database/models';
import Auth from '../auth/auth';
const { Op } = Sequelize;

/**
 *
 *
 * @class ProductController
 */
class ProductController {
    /**
     * get all products
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product data
     * @memberof ProductController
     */
    static async getAllProducts(req, res, next) {
        try {
            let page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
            let limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 20;
            let offset = (page - 1) * limit;
            let description_length = (req.query.description_length && req.query.description_length > 0) ? req.query.description_length : 200;

            const products = await Product.findAndCountAll(
                {
                    limit, offset,
                    attributes: [
                        'product_id', 'name',
                        [Sequelize.fn('LEFT', Sequelize.col('description'), description_length), 'description'],
                        'price', 'discounted_price', 'thumbnail'
                    ]
                });

            let totalRecords = products.count;
            let totalPages = Math.ceil((totalRecords * 1.0) / limit);
            let currentPageSize = (page < totalPages) ? limit : totalRecords - (limit * (totalPages - 1));
            let paginationMeta = { currentPage: page, currentPageSize, totalPages, totalRecords };

            return res.status(200).json({ paginationMeta, rows: products.rows });
        } catch (error) {
            return next(error);
        }
    }

    /**
     * search all products
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product data
     * @memberof ProductController
     */
    static async searchProduct(req, res, next) {
        try {
            let page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
            let limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 20;
            let offset = (page - 1) * limit;
            let description_length = (req.query.description_length && req.query.description_length > 0) ? req.query.description_length : 200;
            const { query_string } = req.query;
            const products = await Product.findAndCountAll(
                {
                    where: {
                        [Op.or]: [
                            {
                                name: { [Op.regexp]: query_string.split(' ').join('|') }
                            },
                            {
                                description: { [Op.regexp]: query_string.split(' ').join('|') }
                            }
                        ]
                    },
                    limit, offset,
                    attributes: [
                        'product_id', 'name',
                        [Sequelize.fn('LEFT', Sequelize.col('description'), description_length), 'description'],
                        'price', 'discounted_price', 'thumbnail'
                    ]
                });
            return res.status(200).json(products);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * get all products by caetgory
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product data
     * @memberof ProductController
     */
    static async getProductsByCategory(req, res, next) {
        try {
            const { category_id } = req.params;

            let page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
            let limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 20;
            let offset = (page - 1) * limit;
            let description_length = (req.query.description_length && req.query.description_length > 0) ? req.query.description_length : 200;

            const products = await Product.findAndCountAll({
                limit, offset,
                attributes: [
                    'product_id', 'name',
                    [Sequelize.fn('LEFT', Sequelize.col('description'), description_length), 'description'],
                    'price', 'discounted_price', 'thumbnail'
                ],
                include: [{ model: Category, where: { category_id }, attributes: [] }]
            });
            return res.status(200).json(products);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * get all products by department
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product data
     * @memberof ProductController
     */
    static async getProductsByDepartment(req, res, next) {
        // implement the method to get products by department
        try {
            const { department_id } = req.params;

            let page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
            let limit = (req.query.limit && req.query.limit > 0) ? req.query.limit : 20;
            let offset = (page - 1) * limit;
            let description_length = (req.query.description_length && req.query.description_length > 0) ? req.query.description_length : 200;

            const products = await Product.findAndCountAll({
                limit, offset,
                attributes: [
                    'product_id', 'name',
                    [Sequelize.fn('LEFT', Sequelize.col('description'), description_length), 'description'],
                    'price', 'discounted_price', 'thumbnail'
                ],
                include: [{ model: Category, where: { department_id }, attributes: [] }]
            });
            return res.status(200).json(products);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * get single product details
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product details
     * @memberof ProductController
     * 
     */
    static async getProduct(req, res, next) {
        const { product_id } = req.params;  // eslint-disable-line
        let description_length = (req.query.description_length && req.query.description_length > 0) ? req.query.description_length : 200;
        try {
            const product = await Product.findByPk(product_id, {
                attributes: [
                    'product_id', 'name',
                    [Sequelize.fn('LEFT', Sequelize.col('description'), description_length), 'description'],
                    'price', 'discounted_price', 'image', 'image_2', 'thumbnail', 'display'
                ]
            });

            if (product) {
                return res.status(200).json(product);
            }
            return res.status(404).json({
                error: {
                    status: 404,
                    message: `Product with id ${product_id} does not exist`,  // eslint-disable-line
                }
            });
        } catch (error) {
            return next(error);
        }
    }

    /**
     * get product reviews
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product details
     * @memberof ProductController
     */
    static async getProductReviews(req, res, next) {
        const { product_id } = req.params;  // eslint-disable-line
        try {
            const reviews = await Review.findAll({
                where: { product_id },
                raw: true,
                attributes: [[Sequelize.col('Customer.name'), 'name'], 'review', 'rating', 'created_on'],
                include: [{
                    model: Customer,
                    as: 'customer',
                    attributes: []
                }]
            });
            return res.status(200).json(reviews);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * add product review
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and product details
     * @memberof ProductController
     */
    static async addProductReview(req, res, next) {
        const { product_id } = req.params;  // eslint-disable-line
        try {
            Auth.isAuthenticated(req, function (result) {
                if (result.status) {
                    const { product_id, review, rating } = req.body;
                    const { customer_id } = result.decoded;
                    Review.create({ customer_id, product_id, review, rating }).then(function (inserted) {
                        const { review_id } = inserted.dataValues;
                        Review.findOne({
                            where: { review_id },
                            raw: true,
                            attributes: [[Sequelize.col('Customer.name'), 'name'], 'review', 'rating', 'created_on'],
                            include: [{
                                model: Customer,
                                as: 'customer',
                                attributes: []
                            }]
                        }).then(function (review) {
                            return res.status(201).json(review);
                        });
                    });
                } else {
                    return res.status(401).json({ error: { status: 401, code: result.code, message: result.message, field: '' } });
                }
            });
        } catch (error) {
            return next(error);
        }
    }


    /**
     * get all departments
     *
     * @static
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next next middleware
     * @returns {json} json object with status and department list
     * @memberof ProductController
     */
    static async getAllDepartments(req, res, next) {
        try {
            const departments = await Department.findAll();
            return res.status(200).json(departments);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Get a single department
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getDepartment(req, res, next) {
        const { department_id } = req.params; // eslint-disable-line
        try {
            if (!isNaN(department_id)) {
                const department = await Department.findByPk(department_id);
                if (department) {
                    return res.status(200).json(department);
                } else {
                    return res.status(404).json({ error: { status: 404, code: "DEP_02", message: 'Don\'t exist department with id', field: "department_id" } });
                }
            } else {
                return res.status(404).json({ error: { status: 404, code: "DEP_01", message: 'The ID is not a number.', field: "department_id" } });
            }
        } catch (error) {
            return next(error);
        }
    }

    /**
     * This method should get all categories
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getAllCategories(req, res, next) {
        // Implement code to get all categories here
        try {
            const categories = await Category.findAndCountAll();
            return res.status(200).json(categories);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * This method should get a single category using the categoryId
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getSingleCategory(req, res, next) {
        const { category_id } = req.params; // eslint-disable-line
        try {
            if (!isNaN(category_id)) {
                const category = await Category.findByPk(category_id);
                if (category) {
                    return res.status(200).json(category);
                } else {
                    return res.status(404).json({ error: { status: 404, code: "CAT_01", message: 'Don\'t exist category with this ID', field: "category_id" } });
                }
            } else {
                return res.status(404).json({ error: { status: 404, code: "CAT_02", message: 'The ID is not a number.', field: "category_id" } });
            }

        } catch (error) {
            return next(error);
        }
    }

    /**
     * This method should get list of categories in a product
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getProductCategories(req, res, next) {
        const { product_id } = req.params;  // eslint-disable-line

        try {
            const categories = await ProductCategory.findAll({
                where: { product_id },
                raw: true,
                attributes: [
                    'category_id', [Sequelize.col('Category.department_id'), 'department_id'], [Sequelize.col('Category.name'), 'name']
                ],
                include: [{
                    model: Category,
                    attributes: []
                }]
            });
            return res.status(200).json(categories);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * This method should get list of categories in a department
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async getDepartmentCategories(req, res, next) {
        const { department_id } = req.params;  // eslint-disable-line

        try {
            const categories = await Category.findAndCountAll({ where: { department_id } });
            return res.status(200).json(categories);
        } catch (error) {
            return next(error);
        }
    }
}

export default ProductController;
