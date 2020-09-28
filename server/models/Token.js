
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('./User')

const Token = db.define('token',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    lastUsed:DataTypes.STRING(20),
    token:DataTypes.STRING(150),
    expiry:DataTypes.STRING(15),
},{freezeTableName: true,
    underscored: true })


module.exports=Token