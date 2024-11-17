// controllers/categoryController.js
const Category = require('../models/category');
const cloudinary = require('cloudinary').v2;

async function getAllCategories(req, res) {
    try {
        const categories = await Category.findAll();
        res.render('category', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories');
    }
}

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        const imageUrl = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;

        if (!name) {
            return res.status(400).send('Category name is required.');
        }

        await Category.create({
            name,
            description,
            imageUrl,
        });

        res.redirect('/admin/categoryAdmin'); // Adjust this path as needed
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Error creating category');
    }
}

async function editCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const imageUrl = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send('Category not found.');
        }

        category.name = name || category.name;
        category.description = description || category.description;
        category.imageUrl = imageUrl || category.imageUrl;

        await category.save();

        res.redirect('/admin/categoryAdmin'); // Adjust this path as needed
    } catch (error) {
        console.error('Error editing category:', error);
        res.status(500).send('Error editing category');
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send('Category not found.');
        }

        await category.destroy();

        res.redirect('/admin/categoryAdmin'); // Adjust this path as needed
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('Error deleting category');
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    editCategory,
    deleteCategory,
};
