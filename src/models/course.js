const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Course = sequelize.define("Course", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  defaultPrice: DataTypes.FLOAT,
thumbnail: DataTypes.STRING, // New field
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
});

module.exports = Course;
