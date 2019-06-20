module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'department'
  });

  /**
   * Initialising the Department Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Department.initialise = function (models) {
    Department.hasMany(models.Category, {
      foreignKey: 'category_id',
      as: 'categories',
    });

    Department.getAllDepartments = async () => {
      const rows = await Department.findAll();
      return { rows };
    };
  };

  Department.removeAttribute('id');
  return Department;
};
