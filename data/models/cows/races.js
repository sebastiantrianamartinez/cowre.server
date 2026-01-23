const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

const TABLE = 'races';

const RacesSchema = {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },

}

class Race extends Model {
    static associate(models) {
        this.hasMany(models.Cow, {
            as: 'cows',
            foreignKey: 'race',
        });
    }   
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,       
            modelName: 'Race',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
}

module.exports = { Race, RacesSchema, TABLE };