
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Answer_Area = require('./answerArea')
const Answer = db.define('answer',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    content:DataTypes.TEXT  ,
    is_correct:DataTypes.INTEGER(1),
    fill_in_the_blank_value:DataTypes.TEXT,
    is_case_sensitive:DataTypes.INTEGER(1),  
    should_ignore_multiple_spaces:DataTypes.INTEGER(1),
    should_trim_user_response:DataTypes.INTEGER(1),
    drag_drop_type:DataTypes.STRING,
})

module.exports=Answer