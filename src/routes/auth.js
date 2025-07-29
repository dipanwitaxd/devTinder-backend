const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    //data validation
    validateSignUpData(req);

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    //creating new instance of the user model using the data recieved from the api
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    console.log();

    await user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("User not found");
    }
    if (!validator.isEmail(emailId)) throw new Error("Invalid Credentials");

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a JWT Token
      const token = await user.getJWT();

      //add the token in cookie and send the response to the user
      res.cookie("token", token);

      res.send("User Logged In succesfully!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
