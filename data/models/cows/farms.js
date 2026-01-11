const { Sequelize, DataTypes, Model } = require('sequelize');

const TABLE = 'farms';

const FarmsSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },  
};

class Farm extends Model {
    static associate(models) {
        this.hasMany(models.Session, {
            as: 'sessions',
            foreignKey: 'farm',
            sourceKey: 'id',
            constraints: false,
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Farm',
            timestamps: true
        }
    }
};

module.exports = { Farm, FarmsSchema, TABLE };