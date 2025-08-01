const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Class = sequelize.define("Class", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  order: DataTypes.INTEGER,
  thumbnail: DataTypes.STRING,
});

module.exports = Class;
