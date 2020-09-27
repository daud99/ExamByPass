
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('./User')

const discountApplicable = db.define('discountApplicable',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    radeemDate:DataTypes.DATE  
  
})

module.exports=discountApplicable