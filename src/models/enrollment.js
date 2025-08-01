const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define("Enrollment", {
  studentName: DataTypes.STRING,
  finalPrice: DataTypes.FLOAT,
});

module.exports = Enrollment;
