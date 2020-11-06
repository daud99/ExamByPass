const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types

const MaxSession = db.define('maxSession',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    max_session_allow: {
        type: DataTypes.INTEGER,
        defaultValue: 3
    }
   
},{freezeTableName: true,
    underscored: true })


module.exports=MaxSession