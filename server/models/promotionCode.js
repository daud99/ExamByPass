const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const PromotionCode = db.define('PromotionCode',{
    id:{
        type:DataTypes.STRING(50) ,
        allowNull:false,
        primaryKey:true
    },
    code:DataTypes.STRING(50),
    max_redemptions:DataTypes.INTEGER,
    expires_at:DataTypes.INTEGER,
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{freezeTableName: true,
    underscored: false })
module.exports=PromotionCode