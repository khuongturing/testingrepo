
export default (sequelize, DataTypes)=> {
    const Department =  sequelize.define('Department', {
        department_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        freezeTableName: true,
        tableName: 'department',
        timestamps: false
    });
    Department.associate = function(models) {
        Department.hasMany(models.Category, {
            foreignKey: 'department_id'
        })
    }
    return Department
};
