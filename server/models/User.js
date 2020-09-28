const Sequelize = require('sequelize')
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Token = require('./Token')
const Invoice = require('./Invoice')
const discountApplicable = require('./discountApplicable')
const Discount = require('./Discount')
const Ticket = require('./Ticket')
const Exam_Library = require('./examLibrary')
const Reset_password_request = require('./resetPasswordRequest')


const User = db.define('user',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    firstName:DataTypes.STRING(180),
    lastName:DataTypes.STRING(180),
    email:DataTypes.STRING(180),
    password:DataTypes.STRING,
    phoneNumber:DataTypes.STRING(20),
    type:DataTypes.STRING(20),
    roles:DataTypes.TEXT,
    uuid:{ 
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    resetPasswordToken:DataTypes.STRING(100),
    resetPasswordExpire:DataTypes.STRING(30),
    emailVerified:DataTypes.STRING(30),
    archieved:DataTypes.STRING(30),
    modifiedId:DataTypes.STRING(20),
    
},{freezeTableName: true,
    underscored: true })



module.exports=User