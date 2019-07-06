export default (sequelize, DataTypes) => {
    const ProductCategory = sequelize.define('ProductCategory', {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    }, {
            freezeTableName: true,
            tableName: 'product_category',
            timestamps: false,
            underscored: true
        });
    return ProductCategory
};
