const { Model, DataTypes } = require('sequelize');

const TABLE = 'aspirations';

const AspirationsSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    donor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    oocytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    viables: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    session: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    vet: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    place: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

class Aspiration extends Model {
    static associate(models) {
        this.belongsTo(models.Cow, {
        as: 'cow',
        foreignKey: 'donor',
        targetKey: 'id',
        constraints: false,   
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,
            modelName: 'Aspiration',
        };
    }
}

module.exports = { Aspiration, AspirationsSchema, TABLE };