const { Model, DataTypes } = require('sequelize');

const TABLE = 'cows';

const CowsSchema = {
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
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    register: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    race: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    appearance: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    control: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
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

class Cow extends Model {
    static associate(models) {
        this.hasMany(models.Aspiration, {
        as: 'aspirations',
        foreignKey: 'donor',
        constraints: false,
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Cow',
            timestamps: true,
        }
    }
}

module.exports = { TABLE, CowsSchema, Cow };