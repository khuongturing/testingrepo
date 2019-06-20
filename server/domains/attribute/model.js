module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define('Attribute', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    }
  }, {
    timestamps: false,
    tableName: 'attribute'
  });

  /**
   * Initialising the Attribute Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Attribute.initialise = function (models) {
    Attribute.hasMany(models.AttributeValue, {
      foreignKey: 'attribute_id',
      as: 'values'
    });

    Attribute.getAllAttributes = async () => {
      const rows = await Attribute.findAll();
      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.attributeId - value of attribute id
     * @param {Function} queryOptions.throwAttributeNotFound - function to call when attribute is not found
     * @returns {Object} - contains fetched rows as property
     */
    Attribute.getValuesForAttribute = async ({ throwAttributeNotFound, attributeId }) => {
      const attribute = await Attribute.findByPk(attributeId);
      if (!attribute) {
        throwAttributeNotFound();
      }
      const rows = await attribute.getValues();
      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.productId - value of product id
     * @param {Function} queryOptions.throwProductNotFound - function to call when product is not found
     * @returns {Object} - contains fetched rows as property
     */
    Attribute.getProductAttributes = async ({ throwProductNotFound, productId }) => {
      const { Product } = models;
      const product = await Product.findByPk(productId);
      if (!product) {
        throwProductNotFound();
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
  };

  Attribute.removeAttribute('id');
  return Attribute;
};
