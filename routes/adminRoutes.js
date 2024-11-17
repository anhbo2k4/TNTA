const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Đảm bảo import adminController đúng
const Category = require('../models/category');
const Post = require('../models/post');
const ContactMessage = require('../models/contact_messages');
const session = require('express-session');
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/authen'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Donate = require('../models/donate'); // Đổi tên biến donate thành Donate để tránh lỗi ReferenceError

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const posts = await Post.findAll();
        const donations = await Donate.findAll();
        const contacts = await ContactMessage.findAll();
        
        const calculateTotalViews = (posts) => {
            return posts.reduce((sum, post) => sum + post.views, 0);
        };
        const calculateTotalDonations = (donations) => {
            return donations.reduce((sum, donation) => sum + donation.amount, 0);
        };
        const totalPosts = posts.length; // Tính tổng số bài viết hiện có
        const totalDonations = calculateTotalDonations(donations); // Tính tổng số tiền donate
        const totalViews = calculateTotalViews(posts); // Tính tổng số view của các bài viết
        const totalContacts = contacts.length; // Tính tổng số tin nhắn liên hệ
        const username = req.session.username; // Lấy username từ session
        res.render('admin/adminDashboard', { username, posts, totalPosts, totalDonations, totalViews, totalContacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users', ensureAuthenticated, adminController.manageUsers); // Đảm bảo manageUsers được định nghĩa trong adminController

router.get('/categoryAdmin', ensureAuthenticated, async (req, res) => {
    try {
        console.log('Fetching categories...');
        const categories = await Category.findAll();
        const username = req.session.username; // Lấy username từ session
        res.render('admin/categoryAdmin', { username, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/newPost', ensureAuthenticated, async (req, res, next) => {
    req.query.page = req.query.page || 1; // Đặt giá trị mặc định cho currentPage nếu không có trong query
    next();
}, adminController.manageNewPost);

router.get('/upPost', ensureAuthenticated, async (req, res) => {
    const categories = await Category.findAll();
    const username = req.session.username; // Lấy username từ session
    res.render('admin/upPost', { categories, username });
});

router.get('/upCategory', ensureAuthenticated, async (req, res) => {
    try {
        const categories = await Category.findAll();
        const username = req.session.username; // Lấy username từ session
        const category = categories.length > 0 ? categories[0] : {}; // Giả sử bạn muốn truyền category đầu tiên
        res.render('admin/upCategory', { categories, username, category });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/createPost', ensureAuthenticated, adminController.createPost);
router.get('/login', forwardAuthenticated, adminController.login);
router.post('/authenticate', adminController.authenticate);
router.get('/logout', ensureAuthenticated, adminController.logout);

router.get('/editPost/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const categories = await Category.findAll();
        const username = req.session.username; // Lấy username từ session
        res.render('admin/updatePost', { post, categories, username });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/editPost/:id', upload.single('image'), ensureAuthenticated, adminController.editPost); // Đảm bảo editPost được định nghĩa trong adminController

router.get('/deletePost/:id', ensureAuthenticated, adminController.deletePost);

router.get('/donations', ensureAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
        const itemsPerPage = 10; // Số lượng mục trên mỗi trang
        const offset = (page - 1) * itemsPerPage;

        const { count, rows: donations } = await Donate.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit: itemsPerPage,
            offset: offset
        }); // Sử dụng biến Donate đã đổi tên và sắp xếp theo created_at giảm dần

        const totalPages = Math.ceil(count / itemsPerPage);
        const username = req.session.username; // Lấy username từ session

        res.render('admin/donateAdmin', { donations, username, currentPage: page, totalPages, itemsPerPage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/donateguest', ensureAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
        const itemsPerPage = 10; // Số lượng mục trên mỗi trang
        const offset = (page - 1) * itemsPerPage;

        const { count, rows: donations } = await Donate.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit: itemsPerPage,
            offset: offset
        }); // Sử dụng biến Donate đã đổi tên và sắp xếp theo created_at giảm dần

        const totalPages = Math.ceil(count / itemsPerPage);
        const username = req.session.username; // Lấy username từ session

        res.json({ donations, username, currentPage: page, totalPages, itemsPerPage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/contactAdmin', ensureAuthenticated, adminController.manageContactMessages);
router.get('/deleteContact/:id', ensureAuthenticated, adminController.deleteContactMessage);


module.exports = router;
