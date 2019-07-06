export default (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'review',
        timestamps: false
    });
    Review.associate = function(models){
        Review.belongsTo(models.Customer, {
            foreignKey: 'customer_id'
        }),
        Review.belongsTo(models.Product, {
            foreignKey: 'product_id'
        })
    }
    return Review
};
