const { Sequelize, DataTypes, Model } = require('sequelize');

const {sequelize} = require('./db')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name : {
        type  : DataTypes.STRING,
    },

    password : {
        type  : DataTypes.STRING,
    },
    token : {
        type  : DataTypes.STRING,
        allowNull: true

    },
    isValide : {
        type  : DataTypes.BOOLEAN,
        defaultValue : false
    },
    email : {
        type : DataTypes.STRING,
    }

} , {
    // Other model options go here
    tableName :"users",
    timestamps: false

})


module.exports = {User}