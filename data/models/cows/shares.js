const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

const TABLE = 'shares';

const SharesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    cow: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    percent: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    remarks: {
        type: DataTypes.JSON,
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

class Share extends Model {
    static associate(models) {
        this.belongsTo(models.Cow, {
            as: 'cowData',
            foreignKey: 'cow',
        });

        this.belongsTo(models.User, {
            as: 'ownerData',
            foreignKey: 'owner',
        });
    }   
    
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            timestamps: true,       
            modelName: 'Share',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
}

module.exports = { Share, SharesSchema, TABLE };