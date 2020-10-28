
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const ExamUserSession = db.define('exam_user_session',{
    sid:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    id:DataTypes.INTEGER ,
    TestletId:DataTypes.INTEGER ,
    allow_shuffle_answers	:DataTypes.INTEGER,
    conditionOf:DataTypes.TEXT,
    content:DataTypes.TEXT('long'),  
    description:DataTypes.TEXT('long'),
    examLibraryId:DataTypes.INTEGER(11),
    explanation:DataTypes.TEXT('long'),
    extras:DataTypes.TEXT,
    has_exhibits:DataTypes.INTEGER(1),
    task_image:DataTypes.TEXT('long'),
    is_accessible_in_demo_version:DataTypes.INTEGER(1),
    offset:DataTypes.INTEGER(11),
    type:DataTypes.STRING(255),
    userId:DataTypes.INTEGER 
   
},{freezeTableName: true,
    underscored: false })


module.exports=ExamUserSession