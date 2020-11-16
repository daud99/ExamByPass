
const db = require("../config/db.js")
const { DataTypes } = require("sequelize"); // Import the built-in data types
const Question = require('./Question')
const Structure_Entry = require('./structureEntry')
const Structure_Entry_Question_Link = require('./structureEntryQuestionLink')
const Testlet = require('./Testlet')
const User = require('./User')

const examLibrary = db.define('exam_library',{
    id:{
        type:DataTypes.INTEGER ,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    },
    add_by_guest:DataTypes.INTEGER(1)  ,
    crc32:DataTypes.STRING,
    description:DataTypes.TEXT,
    exam_name:DataTypes.STRING,  
    exam_number:DataTypes.STRING,
    hash:DataTypes.TEXT,
    is_import_completed:DataTypes.INTEGER(1),
    original_file_name:DataTypes.STRING,
    passing_score:DataTypes.DOUBLE,
    real_question_count:DataTypes.INTEGER,
    guest_user_id:DataTypes.INTEGER,
    share_dropbox_string:DataTypes.TEXT  ,
    share_onedrive_string:DataTypes.TEXT,
    share_url:DataTypes.TEXT,
    size:DataTypes.DOUBLE,  
    time_limit	:DataTypes.INTEGER,
    type:DataTypes.STRING,
   deleted:DataTypes.BOOLEAN
},{freezeTableName: true,
    underscored: true })



module.exports=examLibrary