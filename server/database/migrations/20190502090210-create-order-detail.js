module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('order_detail', {
    item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    attributes: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    product_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    unit_cost: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('order_detail')
};
