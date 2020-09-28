
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const answerArea = db.define('answer_area',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    left_position:DataTypes.INTEGER  ,
    top:DataTypes.INTEGER,
    width:DataTypes.INTEGER,
    height:DataTypes.INTEGER,  
    is_right_answer:DataTypes.INTEGER(1),
    place_type:DataTypes.STRING,
    group_index:DataTypes.INTEGER,
    correct_object_index:DataTypes.INTEGER,
    position:DataTypes.INTEGER,
    owned_place_index:DataTypes.INTEGER,
},
{
    freezeTableName: true,
    underscored: true })
module.exports=answerArea