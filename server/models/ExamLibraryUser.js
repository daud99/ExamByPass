
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types


const examLibraryUser = db.define('exam_library_user',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    user_id: DataTypes.INTEGER,
    exam_library_id: DataTypes.INTEGER
},{freezeTableName: true,
    underscored: true })



module.exports=examLibraryUser