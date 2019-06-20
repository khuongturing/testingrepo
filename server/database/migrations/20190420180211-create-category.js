
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('category', {
    category_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true
    },
    department_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING(1000),
      defaultValue: null
    },
  }),
  down: queryInterface => queryInterface.dropTable('category')
};
