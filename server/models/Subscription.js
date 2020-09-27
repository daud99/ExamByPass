
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('../models/User')
const Subscription = db.define('subscription',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    title:DataTypes.STRING(30),
    duration:DataTypes.STRING(15),
    amount:DataTypes.STRING(15),
})

module.exports=Subscription