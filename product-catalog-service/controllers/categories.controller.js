const Category = require('../models/categories.model');

const getCategories = async (req, res) => { 
    try {
        const categories = await Category.findAll();
        return res.status(200).json(categories);    
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json(category);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        await category.update(req.body);
        return res.status(200).json(category);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        await category.destroy();
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}