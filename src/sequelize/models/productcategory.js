'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define (
    'ProductCategory',
    {
      product_id: {
        type: DataTypes.INTEGER,
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'product_category',
    }
  );
  ProductCategory.associate = function (models) {
    // associations can be defined here
  };
  return ProductCategory;
};
