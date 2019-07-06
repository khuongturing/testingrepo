export default (sequelize, DataTypes) => {
    const ShoppingCart = sequelize.define('ShoppingCart', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cart_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attributes: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        buy_now: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        added_on: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
            freezeTableName: true,
            tableName: 'shopping_cart',
            timestamps: false
        });
    ShoppingCart.associate = function (models) {
        ShoppingCart.hasMany(models.Product, {
            foreignKey: 'product_id'
        })
    }
    return ShoppingCart
};
