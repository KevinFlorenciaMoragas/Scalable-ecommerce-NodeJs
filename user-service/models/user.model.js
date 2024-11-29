const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin','user'),
        defaultValue: 'user',
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    country: {
        type: DataTypes.ENUM("Spain","France","Germany","Italy","Portugal","United Kingdom"),
        defaultValue: "Spain",
        allowNull:false
    }
}, {
    timestamps: true
});
module.exports = User;