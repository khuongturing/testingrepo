module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('shipping', {
    shipping_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    shipping_type: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    shipping_cost: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    shipping_region_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('shipping')
};
