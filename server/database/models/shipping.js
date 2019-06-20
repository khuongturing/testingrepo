module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define('Shipping', {
    shipping_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    shipping_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, { freezeTableName: true, tableName: 'shipping', timestamps: false });
  Shipping.associate = (models) => {
    // associations can be defined here
    Shipping.belongsTo(models.ShippingRegion, {
      foreignKey: 'shipping_region_id',
      targetKey: 'shipping_region_id',
      onDelete: 'CASCADE'
    });
  };
  return Shipping;
};
