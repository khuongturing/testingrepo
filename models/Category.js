
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT
    }, {
        freezeTableName: true,
        tableName: 'category',
        timestamps: false,
            underscored: true

    });
    Category.associate = function(models) {
        Category.belongsTo(models.Department, {
            as: 'departments',
            foreignKey: 'department_id'
        }),
        Category.belongsToMany(models.Product, {
            through: 'ProductCategory',
            foreignKey: 'category_id'
        })
    }
    return Category 
};
