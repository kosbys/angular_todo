const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  due: { type: Date, required: false },
  done: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: { type: [TaskSchema], default: [] },
});

UserSchema.methods.comparePasswords = (password) => {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
