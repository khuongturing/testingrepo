export default (sequelize, DataTypes)=> {
    const Attribute = sequelize.define('Attribute', {
        attribute_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'attribute',
        timestamps: false,
        underscored: true

    });
    Attribute.associate = (models) => {
        Attribute.hasMany(models.AttributeValue, {
            foreignKey: 'attribute_id'
        })
    }
    return Attribute
};
