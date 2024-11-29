const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('productsdb', 'root', 'monlau21!', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
module.exports = sequelize;