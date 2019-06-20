import { getDBQueryPaginationOptions } from 'src/utils/pagination';
import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    discounted_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    image_2: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    display: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'product',
    scopes: {
      search(whereObject) {
        return {
          where: whereObject
        };
      },
    },
  });

  /**
   * Initialising the Product Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Product.initialise = function (models) {
    Product.belongsToMany(models.Category, {
      foreignKey: 'product_id',
      otherKey: 'category_id',
      timestamps: false,
      through: 'product_category',
      as: 'categories'
    });

    Product.belongsToMany(models.AttributeValue, {
      foreignKey: 'product_id',
      otherKey: 'attribute_value_id',
      through: 'product_attribute',
      as: 'details',
      timestamps: false,
    });

    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews',
    });

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @returns {Object} - fetched rows, count of all matched records in the database
     */
    Product.getAllProductsAndCount = async ({ paginationMeta }) => {
      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const rows = await Product.findAll({ ...queryPaginationOptions });
      const count = await Product.count();
      return { rows, count };
    };

    /**
     * @param {String}  word - from the query string
     * @returns {Object} - object block for building the search where
     */
    Product.getLikeObject = (word) => {
      return {
        [Op.or]: [
          { description: { [Op.like]: `%${word}%` } },
          { name: { [Op.like]: `%${word}%` } },
        ]
      };
    };

    /**
     * @param {String}  allWords - from the query string
     * @param {String}  queryString - supplied query string
     * @returns {Object} - object block for building the search where
     * @see './docs/searchWhereObject.txt' for the structure
     */
    Product.getSearchWhereObject = (allWords, queryString) => {
      let whereObject;
      if (allWords === 'on') {
        // getting the words present in the query string
        // and forming a like query out of it
        const words = queryString.split(' ');
        const validWords = words.filter(item => item.length > 3);

        if (validWords.length >= 2) {
          const wordLikeObjects = validWords.map(word => Product.getLikeObject(word));
          whereObject = {
            [Op.or]: wordLikeObjects
          };
        }
      } else {
        // treating the queryString as one word
        whereObject = Product.getLikeObject(queryString);
      }
      return whereObject;
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @param {Object} queryOptions.allWords - value to indicate whether search is done for all words
     * @returns {Object} - contains fetched rows, count of all matched records in the database
     */
    Product.getProductsForSearchAndCount = async ({ paginationMeta, allWords, queryString }) => {
      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const searchWhere = Product.getSearchWhereObject(allWords, queryString);
      const rows = await Product.scope({ method: ['search', searchWhere] }).findAll({ ...queryPaginationOptions });
      const count = await Product.scope({ method: ['search', searchWhere] }).count();
      return { rows, count };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @param {Object} queryOptions.categoryId - value of category id
     * @returns {Object} - fetched rows, count of all matched records in the database
     */
    Product.getCategoryProductsAndCount = async ({
      paginationMeta,
      categoryId,
      throwCategoryNotFound,
    }) => {
      const { Category } = models;
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return throwCategoryNotFound();
      }
      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const rows = await category.getProducts({ ...queryPaginationOptions });
      const count = await category.countProducts();
      return { rows, count };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @param {Number} queryOptions.departmentId - value of department id
     * @param {Function} queryOptions.throwDepartmentNotFound - function to call when department is not found
     * @returns {Object} - contains fetched rows, count of all matched records in the database
     */
    Product.getDepartmentProductsAndCount = async ({
      paginationMeta,
      departmentId,
      throwDepartmentNotFound
    }) => {
      const { Department } = models;
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return throwDepartmentNotFound();
      }
      const categories = await department.getCategories({
        include: { model: models.Product, as: 'products', required: true }
      });
      const productIds = [];
      categories.map((category) => {
        category.products.forEach(product => productIds.push(product.product_id));
        return productIds;
      });

      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const rows = await Product.findAll({
        ...queryPaginationOptions,
        where: { product_id: { [Op.in]: productIds } },
      });
      const count = productIds.length;
      return { rows, count };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.productId - value of product id
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - contains fetched rows
     */
    Product.getProductDetails = async ({
      productId,
      throwProductNotFound
    }) => {
      const product = await Product.findByPk(productId);
      if (!product) {
        return throwProductNotFound();
      }

      const rows = await product.getDetails({
        include: [{
          model: models.Attribute,
          as: 'attribute',
          required: true,
        }]
      });

      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.productId - value of product id
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - contains fetched rows
     */
    Product.getProductLocations = async ({
      productId,
      throwProductNotFound
    }) => {
      const product = await Product.findByPk(productId);
      if (!product) {
        return throwProductNotFound();
      }

      const rows = await product.getCategories({
        include: [{
          model: models.Department,
          as: 'department',
          required: true,
        }]
      });

      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.productId - value of product id
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - contains fetched rows and count of all matched record
     */
    Product.getProductReviewsAndCount = async ({
      productId,
      paginationMeta,
      throwProductNotFound
    }) => {
      const product = await Product.findByPk(productId);
      if (!product) {
        return throwProductNotFound();
      }
      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const rows = await product.getReviews({ ...queryPaginationOptions });
      const count = await product.countReviews();

      return { rows, count };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @param {Object} queryOptions.data - data supplied
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - inserted record
     */
    Product.createProductReview = async ({ data, throwProductNotFound, productId }) => {
      const product = await Product.findByPk(productId);
      if (!product) {
        return throwProductNotFound();
      }
      const newProductReview = await product.createReview({ ...data });
      return newProductReview;
    };
  };

  Product.removeAttribute('id');
  return Product;
};
