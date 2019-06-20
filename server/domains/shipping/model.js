module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define('Shipping', {
    shipping_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    shipping_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_cost: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'shipping'
  });

  /**
   * Initialising the Shipping Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Shipping.initialise = function (models) {
    Shipping.belongsTo(models.ShippingRegion, {
      foreignKey: 'shipping_region_id',
      as: 'shipping_region'
    });
  };

  Shipping.removeAttribute('id');
  return Shipping;
};
