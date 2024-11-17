const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  role_id: DataTypes.INTEGER,
 
}, {
  sequelize,
  modelName: 'User',
  timestamps: false, // Tắt timestamps nếu không cần thiết
});

module.exports = User;
