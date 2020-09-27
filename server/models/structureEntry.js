
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Structure_Entry_Question_Link = require('./structureEntryQuestionLink')

const structureEntry = db.define('structure_entry',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    is_accessible_in_demo_version:DataTypes.INTEGER(1)  ,
    name:DataTypes.STRING,
    type:DataTypes.STRING,
    
  
   
})

module.exports=structureEntry