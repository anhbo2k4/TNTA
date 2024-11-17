const Post = require('../models/post');
const Category = require('../models/category');
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.filterPostsByCategory = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        let posts;

        if (categoryId) {
            posts = await Post.findAll({
                where: { categoryId: categoryId }
            });
        } else {
            posts = await Post.findAll();
        }

        if (!posts || posts.length === 0) {
            return res.status(404).render('404', { message: 'No posts found' });
        }
        res.render('posts/index', { posts: posts });
    } catch (error) {
        console.error('Error filtering posts by category:', error);
        res.status(500).render('404', { message: 'Failed to filter posts' });
    }
};

// Xem tất cả bài viết
 // Start of Selection
 // Start of Selection
exports.viewAllPosts = async (req, res) => {
  try {
      const categoryId = req.query.categoryId;
      const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
      const postsPerPage = 9; // Số bài viết mỗi trang
      let posts;
      let categories = req.categories || await Category.findAll(); // Lấy danh mục từ request hoặc từ database

      if (categoryId) {
          const category = await Category.findOne({
              where: { id: categoryId }
          });

          if (!category) {
              return res.status(404).json({ message: 'Category not found' });
          }

          posts = await Post.findAll({
              where: { categoryId: categoryId },
              offset: (page - 1) * postsPerPage,
              limit: postsPerPage
          });
      } else {
          posts = await Post.findAll({
              offset: (page - 1) * postsPerPage,
              limit: postsPerPage
          });
      }

      if (!posts || posts.length === 0) {
          return res.status(404).render('404', { message: 'No posts found', categories: categories });
      }

      const totalPosts = await Post.count({ where: categoryId ? { categoryId: categoryId } : {} });
      const totalPages = Math.ceil(totalPosts / postsPerPage);

      res.render('posts/index', { posts: posts, categories: categories, currentPage: page, totalPages: totalPages, categoryId: categoryId });
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).render('404', { message: 'Failed to fetch posts', categories: [] });
  }
};
// Lấy tên danh mục từ categoryId
exports.getCategoryNameById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findOne({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ categoryName: category.name });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Failed to fetch category' });
    }
};

// Hiển thị bài viết theo danh mục
exports.viewPostsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findOne({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const posts = await Post.findAll({
            where: { categoryId: categoryId }
        });

        res.render('postbyCategory', {
            category: category,
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ message: 'Failed to fetch posts by category' });
    }
};
exports.viewPost = async (req, res) => {
    try {
        const postSlug = req.params.slug;
        const post = await Post.findOne({
            where: { slug: postSlug },
            include: [{ model: Category, as: 'category' }] // Bao gồm thông tin danh mục
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tăng lượt xem mỗi lần bấm vào và cập nhật vào database
        post.views += 1;
        await post.update({ views: post.views });

        const categoryName = post.category ? post.category.name : 'Uncategorized';

        // Lấy tất cả bài viết trong cùng danh mục và sắp xếp theo ngày tạo mới nhất
        const categoryPosts = await Post.findAll({
            where: { categoryId: post.categoryId },
            order: [['createdAt', 'DESC']] // Sắp xếp theo ngày tạo mới nhất
        });

        res.render('posts/detail_post', {
            post: post,
            categoryName: categoryName,
            categoryPosts: categoryPosts,
            layout: 'main', // Ensure the correct layout is used to avoid CSS issues
            postDate: post.createdAt // Thêm hiển thị ngày
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to fetch post' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOne({
            where: { id: postId }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tăng lượt thích mỗi lần bấm vào
        post.likes += 1;
        await post.save();

        res.json({ message: 'Post liked successfully', likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Failed to like post' });
    }
};
// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, categoryId } = req.body;

  // Kiểm tra nếu title hoặc content bị thiếu
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const imageUrl = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  try {
    await Post.create({
      title,
      content,
      author_id: 1,
      categoryId,
      imageUrl,
      slug: slug // Sử dụng slug được tạo từ title
    });
    res.redirect('/admin/newPost');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Edit a post
exports.editPost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post.author_id !== req.user.id) return res.status(403).send('Unauthorized');
  
  post.title = req.body.title;
  post.content = req.body.content;
  post.slug = req.body.title;
  await post.save();
  
  res.redirect('/');
};

// Delete a post
exports.deletePost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post.author_id !== req.user.id) return res.status(403).send('Unauthorized');
  
  await post.destroy();
  res.redirect('/');
};
// About page
exports.about = (req, res) => {
  res.render('aboutus/index');
};

// Contact page
exports.contact = (req, res) => {
  res.render('contact');
};
// Search for posts

exports.searchPosts = async (req, res) => {
  const { query } = req.query;
  try {
    const posts = await Post.findAll({
      where: {
        title: {
          [Op.like]: `%${query}%`
        }
      }
    });
    res.render('search', { posts });
  } catch (error) {
    console.error('Error searching for posts:', error);
    res.status(500).json({ message: 'Failed to search for posts' });
  }
};

// Display top 10 most viewed posts and latest posts
exports.viewTopPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.render('index', { posts: posts });
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    res.status(500).json({ message: 'Failed to fetch latest posts' });
  }
};
