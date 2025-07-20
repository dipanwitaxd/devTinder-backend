const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");
const { userAuth } = require("./middleware/auth");

const app = express();
const { validateSignUpData } = require("./utils/validation");

//converting all the data coming from the apis to readable JS object
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
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

    await user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

app.post("/login", async (req, res) => {
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

//get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    if (!req?.user) throw new Error("No user found");

    res.send(req?.user);
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

// send request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connection Requestion sent successfully!!");
  } catch (err) {
    res.status(400).send("Error :: " + err.message);
  }
});

// Find user by email
app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Find user by id
app.get("/userById", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API - GET /feed that gets all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.status(404).send("User not found");
    } else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted succesfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  const ALLOWED_FEILDS_UPDATE = [
    "skills",
    "about",
    "photoUrl",
    "gender",
    "age",
    "password",
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((item) =>
      ALLOWED_FEILDS_UPDATE.includes(item)
    );
    if (!isUpdateAllowed)
      throw new Error(
        "Some of the fields you are trying to update is not allowed"
      );
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    // await User.findOneAndUpdate({ emailId: req.body.emailId }, data);
    res.send("User updated succesfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED :: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Error connecting to DB");
  });
