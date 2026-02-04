const { Model, DataTypes } = require('sequelize');

const TABLE = 'clivages';

/*
    estado: bx - bi - bl - degenerados - b - bn 
*/

const ClivagesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    aspiration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sperm: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    embryos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lab: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stages: {
        type: DataTypes.JSON,
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

class Clivage extends Model {
    static associate(models) {
        this.belongsTo(models.Cow, {
            as: 'cow',
            foreignKey: 'sperm',
            targetKey: 'id',
            constraints: false,   
        });

    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,
            modelName: 'Clivage',
        };
    }
}

module.exports = { Clivage, ClivagesSchema, TABLE };