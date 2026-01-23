const { Sequelize, DataTypes, Model } = require('sequelize');

const TABLE = 'labs';

const LabsSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },  
    description: {
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

class Lab extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Lab',
            timestamps: true,
        };
    }
}

module.exports = { TABLE, LabsSchema, Lab };