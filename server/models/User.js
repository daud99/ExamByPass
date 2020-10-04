const Sequelize = require('sequelize')
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types

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
    emailVerified:DataTypes.BOOLEAN(),
    archieved:DataTypes.BOOLEAN(),
    modifiedId:DataTypes.STRING(20),
    
},{freezeTableName: true,
    underscored: true })




module.exports=User