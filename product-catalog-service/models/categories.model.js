const sequelize = require('../database/database');
const {DataTypes} = require('sequelize');
const Category = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
})
module.exports = Category;