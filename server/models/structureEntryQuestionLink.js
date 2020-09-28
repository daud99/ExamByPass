
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const structureEntryQuestionLink = db.define('structure_entry_question_link',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    is_accessible_in_demo_version:DataTypes.INTEGER(1) ,

},{
    freezeTableName: true,
    underscored: true 
})
module.exports=structureEntryQuestionLink