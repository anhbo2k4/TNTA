// models/Post.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn nếu cần
const Category = require('../models/category'); // Import model Category

class Post extends Model {}

Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category, // Sửa lại để tham chiếu đúng model Category
            key: 'id',
        },
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Có thể để trống nếu không có ảnh
    },
    audioUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Có thể để trống nếu không có tệp âm thanh
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts', // Đảm bảo tên này khớp với tên bảng trong cơ sở dữ liệu của bạn
    timestamps: true,   // Tự động tạo các cột createdAt và updatedAt
});

// Thiết lập mối quan hệ giữa Post và Category
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' }); // Sửa lại alias thành 'category'

module.exports = Post;
