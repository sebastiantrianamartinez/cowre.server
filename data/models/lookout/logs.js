const { Sequelize, DataTypes, Model } = require('sequelize');

const TABLE = 'logs';

const LogsSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    table: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    target: {
        type: DataTypes.INTEGER,
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

class Log extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Log',
            timestamps: true,
        }
    }
}

module.exports = { LogsSchema, Log, TABLE };