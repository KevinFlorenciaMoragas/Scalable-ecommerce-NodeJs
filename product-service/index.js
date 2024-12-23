const { subscribeToEvents } = require('./pubsub');
const { handleCartEvent,handleProductEvent } = require('./handlers');
require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/products.routes');
const categoryRoutes = require('./routes/categories.routes');
const Category = require('./models/categories.model');
const Product = require('./models/products.model');
const sequelize = require('./database/database');
const cors = require('cors');
const app = express();


async function startApp() {
    app.use(express.json());
    app.use(cors());
    app.use('/api', productRoutes);
    app.use('/api', categoryRoutes);

    Product.belongsTo(Category, { foreignKey: 'categoryId' });
    Category.hasMany(Product, { foreignKey: 'categoryId' });
    app.listen(3001, () => {
        console.log('Server is running on port 3000');
    });
    await subscribeToEvents('cart', handleCartEvent);
    await subscribeToEvents('products', handleProductEvent);
    await sequelize.sync({ force: false });
}

startApp();