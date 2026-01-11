const { Model, DataTypes } = require('sequelize');

const TABLE = 'embryos';

const EmbryosSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    clivage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    aspiration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    donor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sperm: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    quality: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sex: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    storage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    remarks: {
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

class Embryo extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,
            modelName: 'Embryo',
        };
    }
}

module.exports = { EmbryosSchema, Embryo, TABLE };