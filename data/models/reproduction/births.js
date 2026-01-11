const { Model, DataTypes } = require('sequelize');

const TABLE = 'births';

const BirthsSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    recipient: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pregnancy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transfer: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    donor: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sire: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    calf: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    delivery: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    heifer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },  
    place: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: DataTypes.FLOAT,
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
};

class Birth extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,
            modelName: 'Birth',
        };
    }
}

module.exports = { BirthsSchema, Birth, TABLE };