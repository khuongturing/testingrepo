export default (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(1234),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        discounted_price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        image: DataTypes.STRING,
        image_2: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        display: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'product',
        timestamps: false
    });
    Product.associate = function(models){
        Product.belongsToMany(models.Category, {
            through: 'ProductCategory',
            foreignKey: 'product_id'
        }),
        Product.belongsToMany(models.AttributeValue, {
            through: 'ProductAttribute',
            foreignKey: 'product_id'
        }),
        Product.hasMany(models.Review, {
            foreignKey: 'product_id'
        })
        Product.belongsTo(models.ShoppingCart, {
            foreignKey: 'product_id'
        }),
        Product.belongsTo(models.OrderDetail, {
            foreignKey: 'product_id'
        })
    }
    return Product
};
