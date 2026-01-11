const { Model, DataTypes } = require('sequelize');

const TABLE = 'genealogies';

const GenealogiesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    cow: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    father: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    mother: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    family: {
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

class Genealogy extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,
            modelName: 'Genealogy',
        }
    }
}

module.exports = { Genealogy, GenealogiesSchema, TABLE };