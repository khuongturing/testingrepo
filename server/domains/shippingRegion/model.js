module.exports = (sequelize, DataTypes) => {
  const ShippingRegion = sequelize.define('ShippingRegion', {
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    shipping_region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'shipping_region'
  });

  /**
   * Initialising the Shipping Region Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  ShippingRegion.initialise = function (models) {
    ShippingRegion.hasMany(models.Shipping, {
      foreignKey: 'shipping_region_id',
      as: 'shippings'
    });

    ShippingRegion.getAllShippingRegions = async () => {
      const rows = await ShippingRegion.findAll();
      return { rows };
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.shippingRegionId - value of the shipping region id
     * @param {Function} queryOptions.throwRegionNotFound - function to call when shipping region is not found
     * @returns {Object} - contains fetched rows
     */
    ShippingRegion.getShippingsForARegion = async ({
      shippingRegionId,
      throwRegionNotFound
    }) => {
      const region = await ShippingRegion.findByPk(shippingRegionId);
      if (!region) {
        throwRegionNotFound();
      }
      const rows = await region.getShippings();
      return { rows };
    };
  };

  ShippingRegion.removeAttribute('id');
  return ShippingRegion;
};
