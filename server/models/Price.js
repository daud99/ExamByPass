const db = require("../config/db.js");
const { DataTypes } = require("sequelize");

const Price = db.define(
  "Price",
  {
    pid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    currency: DataTypes.STRING(10),
    interval: DataTypes.STRING(10),
    amount: DataTypes.INTEGER
  },
  { freezeTableName: true, underscored: true }
);

module.exports = Price;
