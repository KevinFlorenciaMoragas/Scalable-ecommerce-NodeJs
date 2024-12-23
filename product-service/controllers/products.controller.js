const { publishEvent } = require('../../user-service/pubsub');
const Product = require('../models/products.model');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);   
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const createProduct = async (req, res) => {
    try {
        const {name, description, price, stock, categoryId} = req.body;
        if (!name || !description || !price || !stock || !categoryId) {
            return res.status(400).json({error: 'Name, description, price, stock and categoryId are required'});
        }
        const product = await Product.create(req.body);
        console.log(product.dataValues.id)
        publishEvent('product:created', 'product', { product_id: product.dataValues.id });
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const [updated] = await Product.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedProduct = await Product.findByPk(id);
            return res.status(200).json(updatedProduct);
        }
        throw new Error('Product not found');
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Product.destroy({
            where: { id: id }
        });
        if (deleted) {
            publishEvent('product:deleted', 'product', { product_id: id });
            return res.status(204).json({message: 'Product deleted'});
        }
        throw new Error("Product not found");
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};