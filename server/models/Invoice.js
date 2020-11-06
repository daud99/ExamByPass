
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('./User')

const Invoice = db.define('invoice',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    total: DataTypes.INTEGER,
    invoiceId: DataTypes.STRING,
    issueDate: DataTypes.INTEGER
},{freezeTableName: true,
    underscored: true })

module.exports=Invoice