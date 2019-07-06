export default (sequelize, DataTypes) => {
    const Audit = sequelize.define('Audit', {
        audit_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'audit',
        timestamps: false
    });
    Audit.associate = function (models) {
        Audit.hasMany(models.Orders, {
            foreignKey: 'order_id'
        })
    }
    return Audit
};
