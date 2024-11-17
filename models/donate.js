const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donate = sequelize.define('Donate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'donates'
});

module.exports = Donate;
