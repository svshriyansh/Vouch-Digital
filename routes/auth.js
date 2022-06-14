/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
require("dotenv").config();
const authenticationToken = require("../middleware/auth");
const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
  @route Get auth/:username
  @desc Get specefic user details
  @access public
*/
routes.get("/:username", authenticationToken, async (req, res) => {
  try {
    const data = await User.findOne({ username: req.params.username });
    let userdetail = {};
    if (data) {
      userdetail.firstname = data.firstname;
      userdetail.lastname = data.lastname;
      userdetail._id = data._id;
    } else {
      res.json({ message: "Invalid username" });
    }
    res.json(userdetail);
  } catch (error) {
    res.send(error);
  }
});

/**
  @route POST auth/signup
  @desc Register user
  @access public
*/

routes.post("/signup", async (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let password = req.body.password;

  try {
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({
        message: "Feild missing",
      });
    }
    let user = await User.findOne({ username: username });
    if (user) {
      res.json({
        message: "User already exist",
      });
    }

    user = new User({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
    });

    user = await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
  @route POST auth/signip
  @desc User Login 
  @access public
*/
// required fields missing
routes.post("/signin", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json("No input");
  }
  let username = req.body.username;
  if (!username) {
    console.log(req.body);
    res.json({
      messane: "Username missing",
    });
  }
  let user = await User.findOne({ username: username });
  if (!user) {
    return res.json({ message: "No user registered" });
  }
  try {
    if (!req.body.password) {
      return res.json({ message: "Password missing" });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      user = { username: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Wrong Password" });
  }
});

module.exports = routes;
