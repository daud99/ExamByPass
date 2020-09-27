
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Answer = require('./Answer')
const Structure_Entry_Question_Link = require('./structureEntryQuestionLink')
const Question = db.define('question',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    content:DataTypes.TEXT  ,
    explanation	:DataTypes.TEXT,
    description:DataTypes.TEXT,
    extras:DataTypes.TEXT,  
    has_exhibits:DataTypes.INTEGER(1),
    is_accessible_in_demo_version:DataTypes.INTEGER(1),
    offset:DataTypes.INTEGER,
    type:DataTypes.STRING,
    allow_shuffle_answers:DataTypes.INTEGER(1),
    task_image:DataTypes.TEXT,
   
})


module.exports=Question