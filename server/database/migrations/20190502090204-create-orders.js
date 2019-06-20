module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orders', {
    order_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    created_on: {
      allowNull: false,
      type: Sequelize.DATE
    },
    shipped_on: {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: null
    },
    status: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    comments: {
      allowNull: true,
      type: Sequelize.STRING(255),
      defaultValue: null
    },
    customer_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    auth_code: {
      allowNull: true,
      type: Sequelize.STRING(50),
      defaultValue: null
    },
    reference: {
      allowNull: true,
      type: Sequelize.STRING(50),
      defaultValue: null
    },
    shipping_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    tax_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: null
    }
  }),
  down: queryInterface => queryInterface.dropTable('orders')
};
