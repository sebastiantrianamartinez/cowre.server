const { Sequelize, DataTypes, Model } = require('sequelize');

const TABLE = 'users';

const UsersSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
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

class User extends Model {
    static associate(models) {
        this.hasMany(models.Session, {
        as: 'sessions',
        foreignKey: 'staff',
        constraints: false,
        });
        this.hasOne(models.Group, {
            as: 'groupData',
            foreignKey: 'id',
            sourceKey: 'group',
            constraints: false,
        });
        this.hasMany(models.Aspiration, {
            as: 'aspirations',
            foreignKey: 'donor',
            constraints: false,
        });
        this.hasMany(models.Transfer, { 
            as: 'vetTransfers',
            foreignKey: 'vet',
            constraints: false,
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'User',
            timestamps: true
        }
    }
}

module.exports = { UsersSchema, User, TABLE };