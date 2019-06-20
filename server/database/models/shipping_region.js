
module.exports = (sequelize, DataTypes) => {
  const ShippingRegion = sequelize.define('ShippingRegion', {
    shipping_region_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    shipping_region: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, { freezeTableName: true, tableName: 'shipping_region', timestamps: false });
  ShippingRegion.associate = (models) => {
    // associations can be defined here
    ShippingRegion.hasMany(models.Customer, {
      foreignKey: 'shipping_region_id',
      targetKey: 'shipping_region_id',
      onDelete: 'CASCADE'
    });
    ShippingRegion.hasMany(models.Shipping, {
      foreignKey: 'shipping_region_id',
      targetKey: 'shipping_region_id',
      onDelete: 'CASCADE'
    });
  };
  return ShippingRegion;
};
