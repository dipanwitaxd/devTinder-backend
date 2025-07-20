const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the cookies
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid Request");

    // validate the token
    const { _id } = await jwt.verify(token, "DEV@TINDER@7777");

    //fetch the user details
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
};

module.exports = { userAuth };
