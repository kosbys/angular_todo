const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./User");

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

app.get("/users/:id/tasks", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      res.json({ tasks: user.tasks });
    })
    .catch((err) => {
      res.status(500).json({ message: `Get tasks error: ${err}` });
    });
});

app.get("/users/:id/:taskId", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      const task = user.tasks.id(req.params.taskId);

      res.json({ task });
    })
    .catch((err) => {
      res.status(500).json({ message: `Get tasks error: ${err}` });
    });
});

app.post("/users/:id/task", (req, res) => {
  const { title, description, due } = req.body;

  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newTask = { title, description, due };
      user.tasks.push(newTask);
      return user.save();
    })
    .then(() => res.status(201).json({ message: "Task added successfully" }))
    .catch((err) => res.status(500).json({ error: `Task add error: ${err}` }));
});

app.put("/users/:userId/tasks/:taskId", (req, res) => {
  User.updateOne(
    { _id: req.params.userId, "tasks._id": req.params.taskId },
    { $set: { "tasks.$": req.body } }
  )
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: `Task update error ${err}` });
    });
});

app.delete("/users/:userId/tasks/:taskId", (req, res) => {
  User.updateOne(
    { _id: req.params.userId },
    { $pull: { tasks: { _id: req.params.taskId } } }
  )
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: `Task delete error: ${err}` });
    });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  new User({ username, password })
    .save()
    .then(() => {
      return res.status(201).json({ message: "User registered" });
    })
    .catch((err) => {
      return res.status(400).json({ error: "Registration fail: ", err });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "No user found" });
      }

      user.comparePasswords(password).then((correctPassword) => {
        if (!correctPassword) {
          return res.status(401).json({ error: "Invalid password" });
        }

        res.json({
          token: jwt.sign({ user_id: user._id, username }, JWT_SECRET, {
            expiresIn: "1h",
          }),
        });
      });
    })
    .catch((err) => {
      console.error(`Login error: ${err}`);
    });
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
