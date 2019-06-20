module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    created_on: {
      allowNull: false,
      type: DataTypes.DATE
    },
    shipped_on: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comments: {
      allowNull: true,
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    customer_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    auth_code: {
      allowNull: true,
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    reference: {
      allowNull: true,
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    shipping_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    tax_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    name: DataTypes.VIRTUAL
  }, { freezeTableName: true, tableName: 'orders', timestamps: false });
  Order.associate = (models) => {
    // associations can be defined here
    Order.hasMany(models.OrderDetail, {
      foreignKey: 'order_id',
      targetKey: 'order_id',
      onDelete: 'CASCADE'
    });
    Order.belongsTo(models.Tax, {
      foreignKey: 'tax_id',
      targetKey: 'tax_id',
      onDelete: 'CASCADE'
    });
  };
  return Order;
};
