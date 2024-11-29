const routes = require('express').Router();
const Product = require('../models/products.model');
const { 
    createItem,
    readAllItems,
    deleteItem,
    updateItem,
    readItem
}= require('../../utils/generics.controller')
routes.get('/products',async(req,res) => await readAllItems(req,res, Product));
routes.get('/product/:id',async(req,res) => await readItem(req,res, Product));
routes.post('/product',async(req,res) => await createItem(req,res, Product));
routes.put('/product/:id',async(req,res) => await updateItem(req,res, Product));
routes.delete('/product/:id',async(req,res) => await deleteItem(req,res, Product));

module.exports = routes;