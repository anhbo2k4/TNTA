// models/Category.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {}

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Category.name cannot be null'
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // or false if image is required
    },
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true,
});

module.exports = Category;
