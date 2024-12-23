const routes = require('express').Router();
const Category = require('../models/categories.model');
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories.controller');
routes.get('/categories', async (req, res) => await getCategories(req, res, Category));
routes.get('/category/:id', async (req, res) => await getCategoryById(req, res, Category));
routes.post('/category', async (req, res) => await createCategory(req, res, Category));
routes.put('/category/:id', async (req, res) => await updateCategory(req, res, Category));
routes.delete('/category/:id', async (req, res) => await deleteCategory(req, res, Category));

module.exports = routes;