/* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

import { Op } from 'sequelize';
import asyncRedis from 'async-redis';
import 'dotenv/config';
import Model from '../database/models';
import productHelper from '../helpers/product';
import errorResponse from '../helpers/errorResponse';

const redisClient = asyncRedis.createClient(process.env.REDIS_URL);
const {
  Category, Department, Product
} = Model;
const {
  nestedPagination, filterByDescriptionLength
} = productHelper;

/**
 *
 *
 * @export
 * @class ProductController
 * @description Operations on Products
 */
export default class ProductController {
  /**
    * @description -This method views all products
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - count and products
    */
  static async viewAllProducts(req, res) {
    try {
      const query = {
        limit: 20,
        offset: 0
      };
      if (req.query.limit) {
        query.limit = parseInt(req.query.limit);
      }
      if (req.query.page) {
        query.offset = parseInt(query.limit) * ((parseInt(req.query.page) - 1));
      }
      const { description_length: descriptionLength } = req.query;
      query.attributes = ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'];
      const products = await Product.findAll(query);
      let rows = products;
      if (descriptionLength) {
        rows = filterByDescriptionLength(products, descriptionLength);
      }
      const allProducts = await Product.findAll();
      const count = allProducts.length;
      redisClient.setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify({ count, rows }));
      return res.status(200).json({ count, rows });
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'PRD_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method views a single product
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - product
    */
  static async viewSingleProduct(req, res) {
    try {
      const { product_id: productId } = req.params;
      if (isNaN(productId)) {
        return res.status(400).json({
          error: {
            status: 400,
            message: 'Product id must be a number',
            field: 'product id'
          }
        });
      }
      const product = await Product.findOne({
        where: { product_id: productId },
        attributes: [
          'product_id',
          'name',
          'description',
          'price',
          'discounted_price',
          'image',
          'image_2',
          'thumbnail',
          'display'
        ]
      });
      if (!product) {
        return res.status(404).json({
          error: {
            status: 404,
            message: 'Product cannot be found',
          }
        });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'PRD_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method gets products in a category
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - products in category
    */
  static async getProductsInCategory(req, res) {
    try {
      const { categoryId } = req.params;
      if (isNaN(categoryId)) res.status(400).json(errorResponse(req, res, 400, '', 'The ID is not a number.', 'id'));
      const { page, limit, description_length: descriptionLength } = req.query;
      const query = {
        where: { category_id: categoryId },
        attributes: [],
        include: [{
          model: Product,
          attributes: [
            'product_id',
            'name',
            'description',
            'price',
            'discounted_price',
            'thumbnail'
          ],
          through: { attributes: [] },
        }]
      };
      const category = await Category.findOne(query);
      if (!category) {
        return res.status(404).json(errorResponse(req, res, 404, 'CAT_01', 'Don\'t exist category with this ID', 'category id'));
      }
      let rows = [];
      rows = nestedPagination(category.Products, page, limit);
      if (descriptionLength) {
        rows = filterByDescriptionLength(rows, descriptionLength);
      }
      const count = category.Products.length;
      redisClient.setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify({ count, rows }));
      return res.status(200).json({ count, rows });
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'CAT_500', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method gets products in a department
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - products in department
    */
  static async getProductsInDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      if (isNaN(departmentId)) res.status(400).json(errorResponse(req, res, 400, 'DEP_01', 'The ID is not a number.', 'id'));
      const { page, limit, description_length: descriptionLength } = req.query;
      const query = {
        where: { department_id: departmentId },
        attributes: [
          'department_id'
        ],
        include: [{
          model: Category,
          attributes: [
            'category_id'
          ],
          include: [{
            model: Product,
            attributes: [
              'product_id',
              'name',
              'description',
              'price',
              'discounted_price',
              'thumbnail'
            ],
            through: { attributes: [] },
          }]
        }]
      };
      const department = await Department.findOne(query);
      if (!department) {
        return res.status(404).json(errorResponse(req, res, 404, 'DEP_02', 'Department with this id does not exist', 'id'));
      }
      const allProducts = department.Categories
        .reduce((combinedProducts, category) => combinedProducts.concat(category.Products), []);
      let rows = [];
      rows = nestedPagination(allProducts, page, limit);
      if (descriptionLength) {
        rows = filterByDescriptionLength(rows, descriptionLength);
      }
      const count = allProducts.length;
      redisClient.setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify({ count, rows }));
      return res.status(200).json({ count, rows });
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'DEP_05', error.parent.sqlMessage, ''));
    }
  }

  /**
    * @description -This method search products
    * @param {object} req - The request payload sent from the router
    * @param {object} res - The response payload sent back from the controller
    * @returns {object} - search products
    */
  static async searchProducts(req, res) {
    try {
      const {
        page, limit, description_length: descriptionLength, query_string: queryString
      } = req.query;
      const query = {
        where: {
          [Op.or]: [{
            name: { [Op.like]: `%${queryString}%` },
          }, {
            description: { [Op.like]: `%${queryString}%` }
          }]
        }
      };
      query.attributes = ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'];
      const products = await Product.findAll(query);
      let rows = [];
      rows = nestedPagination(products, page, limit);
      if (descriptionLength) {
        rows = filterByDescriptionLength(rows, descriptionLength);
      }
      const count = products.length;
      redisClient.setex(req.cacheKey, process.env.REDIS_TIMEOUT, JSON.stringify({ count, rows }));
      return res.status(200).json({ count, rows });
    } catch (error) {
      return res.status(500).json(errorResponse(req, res, 500, 'PRD_500', error.parent.sqlMessage, ''));
    }
  }
}
