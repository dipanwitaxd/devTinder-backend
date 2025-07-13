const express = require("express");

const app = express();

//request handler

//This will only handle GET call to user
app.get("/user", (req, res) => {
  res.send({ firstName: "Dipanwita", lastName: "Mandal" });
});

//This will only handle POST call to user
app.post("/user", (req, res) => {
  console.log("Store data in database");
  res.send("Saved data successfully");
});

//This will only handle DELETE call to user
app.delete("/user", (req, res) => {
  res.send(" data deleted successfully");
});

//this will match the all the HTTP methods API calls to /test
app.use("/test", (req, res) => {
  res.send("hello world from the server");
});

//shifted here since the code matches this first and gives the result for all the other routes
// app.use("/", (req, res) => {
//   res.send("hello from the dashboard");
// });

app.listen(7777, () => {
  console.log("Server is successfully listening on port 3000");
});
