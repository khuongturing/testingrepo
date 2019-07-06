export default (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
        shipped_on: DataTypes.DATE,
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comments: DataTypes.STRING,
        customer_id: DataTypes.INTEGER,
        auth_code: DataTypes.STRING,
        shipping_id: DataTypes.INTEGER,
        tax_id: DataTypes.INTEGER
    }, {
            freezeTableName: true,
            tableName: 'orders',
            timestamps: false
        });
    Orders.associate = function (models) {
        Orders.belongsTo(models.OrderDetail, {
            foreignKey: 'order_id'
        }),
        Orders.belongsTo(models.Audit, {
            foreignKey: 'order_id'
        })
    }
    return Orders
};
