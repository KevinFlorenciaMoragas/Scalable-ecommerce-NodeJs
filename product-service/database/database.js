const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('productsdb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
module.exports = sequelize;