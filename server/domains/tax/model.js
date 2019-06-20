module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    tax_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tax_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax_percentage: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'tax'
  });

  /**
   * Initialising the Tax Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Tax.initialise = function (models) {
    Tax.getAllTaxes = async () => {
      const rows = await models.Tax.findAll();
      return { rows };
    };
  };

  Tax.removeAttribute('id');
  return Tax;
};
