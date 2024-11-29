const routes = require('express').Router();
const Category = require('../models/categories.model');
const {
    createItem,
    readAllItems,
    deleteItem,
    updateItem,
    readItem
} = require('../../utils/generics.controller')
routes.get('/categories', async (req, res) => await readAllItems(req, res, Category));
routes.get('/category/:id', async (req, res) => await readItem(req, res, Category));
routes.post('/category', async (req, res) => await createItem(req, res, Category));
routes.put('/category/:id', async (req, res) => await updateItem(req, res, Category));
routes.delete('/category/:id', async (req, res) => await deleteItem(req, res, Category));

module.exports = routes;