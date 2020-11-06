
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('../models/User')
const Subscription = db.define('subscription',{
    subscription_id:{
        type:DataTypes.STRING(30),
        allowNull:false,
        primaryKey:true
    },
    amount:DataTypes.STRING(15),
    status: DataTypes.STRING(15),
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    interval: DataTypes.STRING(100),
    autoCharge: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{freezeTableName: true,
    underscored: true })

module.exports=Subscription