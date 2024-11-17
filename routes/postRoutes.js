const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Category = require('../models/category');
const Donate = require('../models/donate');

// Define routes
router.get('/news', (req, res, next) => {
    req.query.categoryId = req.query.categoryId || null;
    postController.viewAllPosts(req, res, next);
});
router.get('/post/:slug', postController.viewPost); // Ensure viewPost is defined in postController
router.post('/create',upload.single('image'), postController.createPost); // Ensure createPost is defined in postController
router.get('/filter', postController.filterPostsByCategory); // Ensure filterPostsByCategory is defined in postController
router.get('/contact', postController.contact); // Ensure contact is defined in postController
router.get('/category/:categoryId', postController.viewPostsByCategory); // Ensure viewPostsByCategory is defined in postController
router.get('/search', postController.searchPosts); // Ensure searchPosts is defined in postController
router.get('/', postController.viewTopPosts); // Ensure viewTopPosts is defined in postController
router.post('/post/like/:id', postController.likePost); // Ensure likePost is defined in postController
router.get('/donations', async (req, res) => {
    try {
        const donations = await Donate.findAll();
        const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
        res.status(200).json({ donations, totalDonations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});
module.exports = router;
