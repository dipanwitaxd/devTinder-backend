const express = require("express");
const { userAuth } = require("../middleware/auth");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName gender age about skills photoUrl";

// Find all the pending connection requests of the user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({ data: connectionRequest });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Find all the pending connection requests of the user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest?.map((row) => {
      if (loggedInUser?._id.toString() === row.fromUserId._id.toString())
        return row.toUserId;
      else return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API - GET /feed that gets all the users from the database
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    // hideUsersFromFeed.add(req.user._id.toString());

    connectionRequest.forEach((item) => {
      hideUsersFromFeed.add(item.fromUserId.toString());
      hideUsersFromFeed.add(item.toUserId.toString());
    });

    // const usersInFeed = (await User.find({})).filter(
    //   (item) => !hideUsersFromFeed.has(item._id.toString())
    // );
    const usersInFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: usersInFeed });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = userRouter;
