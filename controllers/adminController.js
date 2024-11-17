const User = require('../models/user');
const Post = require('../models/post');
const Category = require('../models/category');
const cloudinary = require('cloudinary').v2;
const session = require('express-session');
const ContactMessage = require('../models/contact_messages');
exports.login = (req, res) => {
  res.render('admin/login');
};

exports.authenticate = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/');
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.redirect('/');
    }

    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.redirect('/');
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role_id = user.role_id;
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/admin');
  });
};

// Quản lý bài viết (Admin/Moderator)
exports.managePosts = async (req, res) => {
  const posts = await Post.findAll();
  res.render('admin/adminDashboard', { username: req.user.username, posts: posts });
};

// Quản lý người dùng
exports.manageUsers = async (req, res) => {
  const users = await User.findAll();
  res.render('admin/manageUsers', { users });
};

// Lấy tất cả danh mục (Admin)
exports.getAllCategoriesAdmin = async (req, res) => {
  const categories = await Category.findAll();
  res.render('admin/categoryAdmin', { categories });
};
  
exports.manageNewPost = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
    const postsPerPage = 10; // Số bài viết mỗi trang

    const { count, rows: posts } = await Post.findAndCountAll({
      offset: (currentPage - 1) * postsPerPage,
      limit: postsPerPage
    });

    const totalPages = Math.ceil(count / postsPerPage);

    res.render('admin/newPost', { 
      posts, 
      currentPage, 
      totalPages 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).render('404', { message: 'Failed to fetch posts' });
  }
};

// Tạo bài viết mới (Admin)
exports.createPost = async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const categoryId = req.body.categoryId;

    // Kiểm tra nếu các trường cần thiết không có giá trị
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const imageUrl = req.file ? (await cloudinary.v2.uploader.upload(req.file.path)).secure_url : null;

    await Post.create({
      title,
      content,
      categoryId,
      imageUrl,
      author_id: req.body.authorId, // Lấy author_id từ req.body.authorId
    });

    res.redirect('/admin/newPost');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};
// Sửa bài viết (Admin)
exports.editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, categoryId } = req.body;

    // Kiểm tra nếu các trường cần thiết không có giá trị
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const imageUrl = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;

    await post.update({
      title,
      content,
      categoryId,
      imageUrl,
    });

    res.redirect('/admin/newPost');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

// Xóa bài viết (Admin)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();

    res.redirect('/admin/newPost');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

exports.manageContactMessages = async (req, res) => {
  const messages = await ContactMessage.findAll();
  res.render('admin/contactAdmin', { messages });
};

exports.deleteContactMessage = async (req, res) => {
  const messageId = req.params.id;
  await ContactMessage.destroy({ where: { id: messageId } });
  res.redirect('/admin/contactAdmin');
};

