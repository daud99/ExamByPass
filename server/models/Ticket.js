
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Comment = require('./Comment')

const Ticket = db.define('ticket',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    title:DataTypes.STRING(30),
    description:DataTypes.STRING(500),
    status:DataTypes.STRING(15),
 
})

module.exports=Ticket