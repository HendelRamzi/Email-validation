const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('emailval', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql' 
})


module.exports = {sequelize}