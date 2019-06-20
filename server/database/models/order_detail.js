module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attributes: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, { freezeTableName: true, tableName: 'order_detail', timestamps: false });
  OrderDetail.associate = (models) => {
    // associations can be defined here
    OrderDetail.belongsTo(models.Order, {
      foreignKey: 'order_id',
      targetKey: 'order_id',
      onDelete: 'CASCADE'
    });
    OrderDetail.belongsTo(models.Product, {
      foreignKey: 'product_id',
      targetKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return OrderDetail;
};
