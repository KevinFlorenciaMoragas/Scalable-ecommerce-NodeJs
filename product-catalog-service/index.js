const express = require('express');
const productRoutes = require('./routes/products.routes');
const categoryRoutes = require('./routes/categories.routes');
const Category = require('./models/categories.model');
const Product = require('./models/products.model');
const cors = require('cors');
const app = express();
const sequelize = require('./database/database');
async function startApp() {
    app.use(express.json());
    app.use('/api', productRoutes);
    app.use('/api', categoryRoutes);
    app.use(cors())
    Product.belongsTo(Category, { foreignKey: 'categoryId' });
    Category.hasMany(Product, { foreignKey: 'categoryId' });
    app.listen(4000, () => {
        console.log('Server is running on port 3000');
    });
    await sequelize.sync({ alter: true })
}
startApp();