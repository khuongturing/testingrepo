module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tax', {
    tax_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    tax_type: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    tax_percentage: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('tax')
};
