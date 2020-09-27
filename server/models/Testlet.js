
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Question = require('./Question')

const Testlet = db.define('Testlet',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    b:DataTypes.STRING  ,
    overview:DataTypes.TEXT,
    title:DataTypes.STRING,
   
})


module.exports=Testlet