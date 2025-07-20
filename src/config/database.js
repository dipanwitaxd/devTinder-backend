const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dipanwitaxd:sErq5F0gNN5tTyKL@nodeproject.wpx9xi9.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

