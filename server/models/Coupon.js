const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Coupon = db.define('coupon',{
    id:{
        type:DataTypes.STRING(50) ,
        allowNull:false,
        primaryKey:true
    },
    name:DataTypes.STRING(180),
    amount_off:DataTypes.STRING(180),
    percent_off:DataTypes.STRING(180),
    duration:DataTypes.STRING(280),
    duration_in_months:DataTypes.INTEGER,
    max_redemptions:DataTypes.INTEGER,
    redeem_by:DataTypes.INTEGER,
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD"
    }
},{freezeTableName: true,
    underscored: false })
module.exports=Coupon