
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types

const Question = db.define('question',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    content:DataTypes.TEXT('long') ,
    explanation	:DataTypes.TEXT('long'),
    description:DataTypes.TEXT('long'),
    extras:DataTypes.TEXT,  
    has_exhibits:DataTypes.INTEGER(1),
    is_accessible_in_demo_version:DataTypes.INTEGER(1),
    offset:DataTypes.INTEGER,
    type:DataTypes.STRING,
    allow_shuffle_answers:DataTypes.INTEGER(1),
    task_image:DataTypes.TEXT('long'),
   
},{freezeTableName: true,
    underscored: true })


module.exports=Question