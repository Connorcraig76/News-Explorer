const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        email,
        password: hashedPassword,
        name,
      }),
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "A user with this email already exists." });
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Validation error: invalid data passed." });
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(401).send({ message: err.message });
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
