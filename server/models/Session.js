
const db = require("../config/db.js")
const { DataTypes } = require("sequelize") 

const Session = db.define("Session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  },{freezeTableName: true,
    underscored: true });


module.exports=Session