module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    tax_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tax_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tax_percentage: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, { freezeTableName: true, tableName: 'tax', timestamps: false });
  Tax.associate = (models) => {
    // associations can be defined here
    Tax.hasMany(models.Order, {
      foreignKey: 'tax_id',
      targetKey: 'tax_id',
      onDelete: 'CASCADE'
    });
  };
  return Tax;
};
