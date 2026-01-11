const { Model, DataTypes } = require('sequelize');

const TABLE = 'sessions';

const SessionsSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    table: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    staff: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    farm: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    remarks: {
        type: DataTypes.JSON,
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
}

class Sessions extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
			as: "vet",
			foreignKey: "staff",
			targetKey: "id",
			constraints: false,
		});

        this.belongsTo(models.Farm, {
            as: "farmData",
            foreignKey: "farm",
            targetKey: "id",
            constraints: false,
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Session',
            timestamps: true
        }
    }
};

module.exports = { Sessions, SessionsSchema, TABLE };

