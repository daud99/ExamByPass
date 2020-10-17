
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Contact = db.define('contact_us',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    firstName:DataTypes.STRING(180),
    lastName:DataTypes.STRING(180),
    email:DataTypes.STRING(180),
    problemType:DataTypes.STRING(280),
    message:DataTypes.TEXT
},{freezeTableName: true,
    underscored: false })
module.exports=Contact