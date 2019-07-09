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
import {
  Product,
  Department,
  Category,
  Customer,
  ProductCategory,
  Review,
  Sequelize,
} from '../database/models';
let log = require('fancy-log');
let {create} = require('../validators/review.validator')
let responseMessages = require('../config/responseMessages');
let HttpStatus = require('../lib/httpStatus');
let Response = require('../lib/responseManager');
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
    let {description_length, page, limit} = req.query;
    page = (!page || page < 1 ) ? 1 : parseInt(page);
    limit = parseInt(limit) || 20;
    description_length = parseInt(description_length) || 200
    let offset = (page - 1) * limit;
    console.log({page, limit, offset, description_length})
    const sqlQueryMap = {
      // where: Sequelize.where(Sequelize.fn('length', Sequelize.col('description')), "<=", description_length),
      limit,
      offset,
    };
    try {
      // let totalCount = await Product.count({where: Sequelize.where(Sequelize.fn('length', Sequelize.col('description')), "<=", description_length),})
      let totalCount = await Product.count({})
    if(offset > totalCount) return Response.failure(res, responseMessages.PAGE_INVALID, HttpStatus.BAD_REQUEST, 'page');
    
    let products = await Product.findAll(sqlQueryMap);
    products = ProductController._parseProducts(products, description_length)
    return Response.success(res, {products, page, count: totalCount});

    } catch (error) {
      log.error(`Error Getting All Products ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
       }
  }

  static _parseProducts(products, description_length){
    return products.map(pdt => {
      return {
        product_id: pdt.product_id,
        name: pdt.name,
        description: pdt.description.length <= description_length ? pdt.description : `${pdt.description.substring(0, description_length)} ...`,
        price: pdt.price,
        discounted_price: pdt.discounted_price,
        thumbnail: pdt.thumbnail,
        image: pdt.image
      }
    })
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
    let { query_string, all_words, page, limit, description_length } = req.query;

    if(!query_string) return Response.failure(res, responseMessages.QUERY_NOT_EXISTS, HttpStatus.BAD_REQUEST, 'query_string')
    page = (!page || page < 1 ) ? 1 : parseInt(page);
    limit = parseInt(limit) || 20;
    description_length = parseInt(description_length) || 200
    let offset = (page - 1) * limit;
    let where_query =  all_words !== 'off' ? {name: query_string} : 
           Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + query_string + '%')
    try{
      let totalCount = await Product.count({
        where: where_query
      })
      if(offset > totalCount) return Response.failure(res, responseMessages.PAGE_INVALID, HttpStatus.BAD_REQUEST, 'page');
      let products = await Product.findAll({
        where: where_query,
        limit,offset
      });
      products = ProductController._parseProducts(products, description_length)
      
      return Response.success(res, {count: totalCount, page, products})
    }catch(error){
      log.error(`Error Searching for Product ${query_string} ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }    
  }

  /**
   * get all products by category
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByCategory(req, res, next) {

    const { category_id } = req.params;
    let {description_length, page, limit} = req.query;

    if(!category_id || typeof parseInt(category_id) !== "number")
    return Response.failure(res, responseMessages.CATEGORY_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'category_id');
    
    page = (!page || page < 1 ) ? 1 : parseInt(page);
    limit = parseInt(limit) || 20;
    description_length = parseInt(description_length) || 200
    let offset = (page - 1) * limit;


    try {
      let totalCount = await ProductCategory.count({
        where: {category_id},
        include: [
          {
            model: Product,
            as: 'product',
            // where: Sequelize.where(Sequelize.fn('length', Sequelize.col('description')), "<=", description_length)
          }
        ]
      })
      if(offset > totalCount) return Response.failure(res, responseMessages.PAGE_INVALID, HttpStatus.BAD_REQUEST, 'page');
     
      let products_category = await ProductCategory.findAll({
        where: {category_id},
        limit,offset,
        include: [
          {
            model: Product,
            as: 'product',
          }
        ]
      })

      products_category = products_category.map(pdt_cat => {
        return {
          product_id: pdt_cat.product_id,
          name: pdt_cat.product.name,
          description: pdt_cat.product.description.length <= description_length ? pdt_cat.product.description :
                                          `${pdt_cat.product.description.substring(0, description_length)} ...`,
          price: pdt_cat.product.price,
          discounted_price: pdt_cat.product.discounted_price,
          thumbnail: pdt_cat.product.thumbnail
        }
      })
      return Response.success(res, {count: totalCount, page, products_category})
    } catch (error) {
      log.error(`Error Getting All Product Categories ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
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

    const { department_id } = req.params;
    let {description_length, page, limit} = req.query;

    if(!department_id || typeof parseInt(department_id) !== "number")
    return Response.failure(res, responseMessages.DEPARTMENT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'department_id');
    
    page = (!page || page < 1 ) ? 1 : parseInt(page);
    limit = parseInt(limit) || 20;
    description_length = parseInt(description_length) || 200
    let offset = (page - 1) * limit;

    try {
      let totalCount = await ProductCategory.count({
        include: [
          {
            model: Category,
            where: {department_id},
          },
          {
            model: Product,
            as: 'product',
          }
        ]
      })
      if(offset > totalCount) return Response.failure(res, responseMessages.PAGE_INVALID, HttpStatus.BAD_REQUEST, 'page');
     
      let products = await ProductCategory.findAll({
        limit,offset,
        include: [
          {
            model: Category,
            where: {department_id},
          },
          {
            model: Product,
            as: 'product',
          }
        ]
      })
      

      products = products.map(pdt => {
        return {
          product_id: pdt.product_id,
          name: pdt.product.name,
          description: pdt.product.description.length <= description_length ? pdt.product.description :
                                          `${pdt.product.description.substring(0, description_length)} ...`,
          price: pdt.product.price,
          discounted_price: pdt.product.discounted_price,
          thumbnail: pdt.product.thumbnail
        }
      })
      return Response.success(res, {count: totalCount, page, products})
    } catch (error) {
      console.log({error})
      log.error(`Error Getting All Product Department ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      
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
   */
  static async getProduct(req, res, next) {

    const { product_id } = req.params;
    if(!product_id || typeof parseInt(product_id) !== "number")
    return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id')

    try {
      const product = await Product.findByPk(product_id);
      if(!product) return Response.failure(res, responseMessages.PRODUCT_NOT_EXISTS, HttpStatus.NOT_FOUND);

      return Response.success(res, {product})
    } catch (error) {
      log.error(`Error Getting Product ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * get  product locations
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product details
   * @memberof ProductController
   */
  static async getProductLocations(req, res, next) {

    const { product_id } = req.params;
    if(!product_id || typeof parseInt(product_id) !== "number")
    return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id')

    try {
      let product = await ProductCategory.findAll({
        where: {product_id},
        include: [
          {
            model: Category,
            include: [Department]
          }
        ]
      })
      if(!product) return Response.failure(res, responseMessages.PRODUCT_NOT_EXISTS, HttpStatus.NOT_FOUND);
      product = {
        category_id: product[0].category_id,
        category_name: product[0].Category.name,
        department_id: product[0].Category.department_id,
        department_name: product[0].Category.Department.name
      }
      return Response.success(res, {product})
    } catch (error) {
      log.error(`Error Getting All Product Locations ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Review a Product
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with review
   * @memberof ProductController
   */
  static async createReview(req, res, next) {
    let {body, customer_id} = req;
    const { product_id } = req.params;
    if(!product_id || typeof parseInt(product_id) !== "number")
    return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id')

    try {
      await create(res, body);
      let new_review = {
        ...body, customer_id, product_id
      }
      let review = await Review.create(new_review, {raw: true});
      return Response.success(res, {review})
    } catch (error) {
      log.error(`Error Creating Review ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Get the reviews of a PRoduct
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with review
   * @memberof ProductController
   */
  static async getReviews(req, res, next) {
    const { product_id } = req.params;
    if(!product_id || typeof parseInt(product_id) !== "number")
    return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id')

    try {
      let reviews = await Review.findAll({
        where: {product_id},
        include: [
          {
            model: Customer
          }
        ]
      });
      reviews = reviews.map(rev => {
        return {

          "review_id": rev.review_id,
          "review": rev.review,
          "rating": rev.rating,
          "created_on": rev.created_on,
          customer_name: rev.Customer.name
        }
      })
      return Response.success(res, {reviews})
    } catch (error) {
      log.error(`Error Getting All Reviews ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * This method should get all categories
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllCategories(req, res, next) {
    let {order, page, limit} = req.query;
    page = (!page || page < 1 ) ? 1 : page;
    limit = limit || 10;
    let offset = (page - 1) * limit;
    order = order === 'category_id' ? ['category_id', 'DESC'] : order === 'name' ? ['name', 'DESC'] : null;

    try{

      let totalCount = await Category.count();
      if(offset > totalCount) return Response.failure(res, responseMessages.PAGE_INVALID, HttpStatus.BAD_REQUEST, 'page');

      let sqlQueryMap = {
        offset: parseInt(offset), limit: parseInt(limit), order: [order]
      }

      let categories = await Category.findAll(sqlQueryMap);
      return Response.success(res, {categories, page, count: totalCount});
    }catch(error){
      log.error(`Error Getting All Categories ${error}`);
      return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }


  }

  /**
   * This method should get a single category using the categoryId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleCategory(req, res, next) {
    const { category_id } = req.params;
      if(!category_id || typeof parseInt(category_id) !== "number")
                return Response.failure(res, responseMessages.CATEGORY_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'category_id')

      try{
        let category = await Category.findByPk(category_id);
        if(!category) return Response.failure(res, responseMessages.CATEGORY_NOT_EXISTS, HttpStatus.NOT_FOUND);
        
        return Response.success(res, {category})
    }catch(error){
        log.error(`Error Getting Category Details for department_id : ${category_id}, {error: ${error}}`);
        return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * This method should get list of categories in a department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartmentCategories(req, res, next) {
    const { department_id } = req.params;  

    if(!department_id || typeof parseInt(department_id) !== "number")
                return Response.failure(res, responseMessages.DEPARTMENT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'department_id');
      try{
      let {rows, count} = await Category.findAndCountAll({where: {department_id}, include: [Department]});
      let department_categories = rows.map(dept_cat => {
        return {
          category_id: dept_cat.category_id,
          department_id: dept_cat.Department.department_id,
          name: dept_cat.name,
          description: dept_cat.Department.description
        }
      })
      return Response.success(res, {count, department_categories})

  }catch(error){
    log.error(`Error Getting Department Categories ${error}`);
    return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
  }

  /**
   * This method should get list of categories of a product
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getProductCategories(req, res, next) {
    const { product_id } = req.params;

    if(!product_id || typeof parseInt(product_id) !== "number")
                return Response.failure(res, responseMessages.PRODUCT_ID_NOT_NUMBER, HttpStatus.BAD_REQUEST, 'product_id');
      try{
      let {rows, count} = await ProductCategory.findAndCountAll({where: {product_id}, include: [Category]});
      let product_categories = rows.map(pdt_cat => {
        return {
          category_id: pdt_cat.category_id,
          department_id: pdt_cat.Category.department_id,
          name: pdt_cat.Category.name,
        }
      })
      return Response.success(res, {count, product_categories})

  }catch(error){
    log.error(`Error Getting Product Categories ${error}`);
    return Response.failure(res, responseMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

}

export default ProductController;
