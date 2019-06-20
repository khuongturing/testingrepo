module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    product_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
  }, {
    timestamps: false,
    tableName: 'product_category'
  });

  ProductCategory.removeAttribute('id');
  return ProductCategory;
};
