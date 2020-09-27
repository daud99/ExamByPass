
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Comment = db.define('comment',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    text:DataTypes.TEXT,
    isHelpful:DataTypes.BOOLEAN,
 
})
module.exports=Comment