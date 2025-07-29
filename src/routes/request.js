const express = require("express");

const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middleware/auth");

// send request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;

      const allowedStatus = ["ignored", "interested"];

      const userId = await User.findById(toUserId);
      if (!userId) {
        res.status(404).json({ message: "User Not Found!!" });
      }

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status Type : " + status);
      }

      //if there already is a connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        res.status(400).json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          status === "interested"
            ? "Request sent successfully!!"
            : "Ignored user!",
        data,
      });
    } catch (err) {
      res.status(400).send("Error :: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status Type : " + status);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log(requestId, loggedInUser._id);
      if (!connectionRequest) {
        res.status(404).json({ message: "Connection Request not Found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Request ${status === "accepted" ? "Accepted" : "Rejected"}!`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error :: " + err.message);
    }
  }
);

module.exports = requestRouter;
