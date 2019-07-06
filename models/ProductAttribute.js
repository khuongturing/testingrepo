export default (sequelize, DataTypes) => {
    const ProductAttribute = sequelize.define('ProductAttribute', {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        attribute_value_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    }, {
            freezeTableName: true,
            tableName: 'product_attribute',
            timestamps: false,
            underscored: true
        });
    return ProductAttribute
};
