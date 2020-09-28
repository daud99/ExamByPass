
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const User = require('./User')

const resetPasswordRequest = db.define('reset_password_request',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    selector:DataTypes.STRING(20)  ,
    hashed_token:DataTypes.STRING(100),
    requested_at:DataTypes.DATE,
    expires_at	:DataTypes.DATE,  
    
   
},{
    freezeTableName: true,
    underscored: true 
})


module.exports=resetPasswordRequest