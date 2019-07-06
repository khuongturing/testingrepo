export default (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
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
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_cost: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'order_detail',
        timestamps: false
    });
    OrderDetail.associate = function(models){
        OrderDetail.hasMany(models.Orders, {
            foreignKey: 'order_id'
        }),
        OrderDetail.hasMany(models.Product, {
            foreignKey: 'product_id'
        })
    }
    return OrderDetail
};
