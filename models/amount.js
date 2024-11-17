const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Amount = sequelize.define('Amount', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'amounts',
    timestamps: false
});

module.exports = Amount;
