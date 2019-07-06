export default(sequelize, DataTypes) => {
    const Shipping = sequelize.define('Shipping', {
        shipping_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shipping_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_cost: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        shipping_region_id: DataTypes.INTEGER
    },{
        freezeTableName: true,
        tableName: 'shipping',
        timestamps: false
    });
    return Shipping
};
