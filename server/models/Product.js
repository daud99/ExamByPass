const db = require("../config/db.js");
const { DataTypes } = require("sequelize");

const Product = db.define(
  "Product",
  {
    pid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING(180),
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  { freezeTableName: true, underscored: true }
);

module.exports = Product;
