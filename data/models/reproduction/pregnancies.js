const { Model, DataTypes } = require('sequelize');

const TABLE = 'pregnancies';

const PregnanciesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    transfer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    diagnosis_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uterus: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    embryo_size: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    heartbeat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    technician: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

};

class Pregnancies extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Pregnancy',
            timestamps: true
        };
    }
}

module.exports = { TABLE, PregnanciesSchema, Pregnancies };
