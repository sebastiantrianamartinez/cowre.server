const { Model, DataTypes } = require('sequelize');

const TABLE = 'races';

const RacesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,      
    }
}

class Race extends Model {
    static associate(models) {
        this.hasMany(models.Cow, {
            as: 'cows',
            foreignKey: 'race',
        });
    }   
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,       
            modelName: 'Race',
        }
    }
}

module.exports = { Race, RacesSchema, TABLE };