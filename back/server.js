const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./User");

// add tasks

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

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt));

  new User({ username, password: hashedPassword })
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
