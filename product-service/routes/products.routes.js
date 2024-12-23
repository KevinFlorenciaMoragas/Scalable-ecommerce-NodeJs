const routes = require('express').Router();
const Product = require('../models/products.model');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');
routes.get('/products', async (req, res) => await getProducts(req, res, Product));
routes.get('/product/:id', async (req, res) => await getProductById(req, res, Product));
routes.post('/product', async (req, res) => await createProduct(req, res, Product));
routes.put('/product/:id', async (req, res) => await updateProduct(req, res, Product));
routes.delete('/product/:id', async (req, res) => await deleteProduct(req, res, Product));

module.exports = routes;