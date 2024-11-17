const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Category = require('../models/category');

 // Ensure this matches your multer config
router.get('/', categoryController.getAllCategories);
router.post('/create', upload.single('image'), categoryController.createCategory);
router.post('/update/:id', upload.single('image'), categoryController.editCategory);
router.get('/delete/:id', categoryController.deleteCategory);

router.get('/edit/:id', async (req, res) => {
    
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
        return res.status(404).send('Category not found.');
    }
    const username = req.user ? req.user.username : "Admin";
    const user = req.user; // Lấy thông tin user từ req.user
    res.render('admin/updateCategory', { category, username, user });
});
module.exports = router;
