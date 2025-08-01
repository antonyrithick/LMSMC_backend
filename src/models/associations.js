
const User = require("./userModel");
const Role = require("./roleModel");
const Message = require("./messageModel");
const Course = require("./course");
const Class = require("./class");
const Enrollment = require("./enrollment");

Course.hasMany(Class, { onDelete: "CASCADE" });
Class.belongsTo(Course);

Course.hasMany(Enrollment, { onDelete: "CASCADE" });
Enrollment.belongsTo(Course);
User.belongsTo(Role, { foreignKey: "RoleId" });


Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });
User.hasMany(Message, { foreignKey: "senderId", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "ReceivedMessages" });
module.exports = { User, Role, Message,Course,
  Class,
  Enrollment, };
