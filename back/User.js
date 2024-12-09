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

UserSchema.methods.comparePasswords = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
