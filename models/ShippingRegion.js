export default (sequelize, DataTypes) => {
    const ShippingRegion = sequelize.define('ShippingRegion', {
        shipping_region_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shipping_region: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'shipping_region',
        timestamps: false
        });
    return ShippingRegion
};
