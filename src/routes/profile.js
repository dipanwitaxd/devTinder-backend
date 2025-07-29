const express = require("express");
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    if (!req?.user) throw new Error("No user found");

    res.send(req?.user);
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

// Delete user by id
profileRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted succesfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update data of the user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req))
      throw new Error(
        "Some of the fields you are trying to update is not allowed"
      );
    // await User.findByIdAndUpdate(userId, data, {
    //   runValidators: true,
    // });
    // await User.findOneAndUpdate({ emailId: req.body.emailId }, data);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    console.log(loggedInUser);

    res.json({
      message: `Profile updated succesfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("UPDATE FAILED :: " + err.message);
  }
});

// Update data of the user
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const previousPassword = req.body.previousPassword;

    const isPasswordValid = await bcrypt.compare(
      previousPassword,
      loggedInUser.password
    );

    if (!isPasswordValid) throw new Error("Entered wrong previous password!");

    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);

    const user = await User.findByIdAndUpdate(loggedInUser._id, {
      password: passwordHash,
    });

    await user.save();

    res.json({
      message: `Password updated succesfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("UPDATE FAILED :: " + err.message);
  }
});

module.exports = profileRouter;
