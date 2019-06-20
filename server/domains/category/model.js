import { getDBQueryPaginationOptions } from 'src/utils/pagination';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'category'
  });

  /**
   * Initialising the Category Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Category.initialise = function (models) {
    Category.belongsToMany(models.Product, {
      foreignKey: 'category_id',
      otherKey: 'product_id',
      timestamps: false,
      through: 'product_category',
      as: 'products'
    });

    Category.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.paginationMeta - pagination properties from http request
     * @returns {Object} - contains fetched rows, count of all matched records in the database
     */
    Category.getAllCategoriesAndCount = async ({ paginationMeta }) => {
      const queryPaginationOptions = getDBQueryPaginationOptions(paginationMeta);
      const rows = await Category.findAll({
        ...queryPaginationOptions
      });
      const count = await Category.count();
      return { rows, count };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.productId - value of product id
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - contains fetched rows
     */
    Category.getProductCategories = async ({ productId, throwProductNotFound }) => {
      const { Product: ProductModel } = models;
      const product = await ProductModel.findByPk(productId);
      if (!product) {
        throwProductNotFound();
      }
      const rows = await product.getCategories();
      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.departmentId - value of department id
     * @param {Function} queryOptions.throwDepartmentNotFound - function to call when department is not found
     * @returns {Object} - contains fetched rows
     */
    Category.getDepartmentCategories = async ({ departmentId, throwDepartmentNotFound }) => {
      const { Department } = models;
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return throwDepartmentNotFound();
      }
      const rows = await department.getCategories();
      return { rows };
    };
  };

  Category.removeAttribute('id');

  return Category;
};
