const express = require("express");

const app = express();

//request handler
app.use("/", (req, res) => {
  res.send("hello from the dashboard");
});

app.use("/hello", (req, res) => {
  res.send("hello hello hello");
});

app.use("/test", (req, res) => {
  res.send("hello world from the server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
