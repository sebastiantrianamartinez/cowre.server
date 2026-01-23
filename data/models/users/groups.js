const { Sequelize, DataTypes, Model } = require('sequelize');

const TABLE = 'groups';

const GroupsSchema = {
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

class Group extends Model {
    static associate(models) {
        this.hasMany(models.User, {
            as: 'users',
            foreignKey: 'group',
            constraints: false,
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Group',
            timestamps: true,
        };
    }
}

module.exports = { TABLE, GroupsSchema, Group };