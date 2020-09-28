
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('./User')

const Discount = db.define('discount',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    title:DataTypes.STRING(30),
    code:DataTypes.STRING(150),
    startDate:DataTypes.DATE ,
    endDate:DataTypes.DATE ,
    discountType:DataTypes.STRING(15),
    amount:DataTypes.DATE ,
    isActive:DataTypes.BOOLEAN,
},{freezeTableName: true,
    underscored: true })

module.exports=Discount