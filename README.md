# devTinder-backend

A platform for all the developers to connect
Tinder like connection platform for developers

Node.js Notes

//request handler

//This will only handle GET call to user
// app.get("/user", (req, res) => {
// console.log(req.query);
// res.send({ firstName: "Dipanwita", lastName: "Mandal" });
// });

// //dynamic route
// app.get("/user/:userId", (req, res) => {
// console.log(req.params);
// res.send({ firstName: "Dipanwita", lastName: "Mandal" });
// });

// //This will only handle POST call to user
// app.post("/user", (req, res) => {
// console.log("Store data in database");
// res.send("Saved data successfully");
// });

// //This will only handle DELETE call to user
// app.delete("/user", (req, res) => {
// res.send(" data deleted successfully");
// });

// //this will match the all the HTTP methods API calls to /test
// app.use(
// "/test",
// (req, res, next) => {
// // res.send("hello world from the server");
// throw new Error('Error')
// },
// (req, res) => {
// res.send("hello world from the server 2");
// }
// );

// //shifted here since the code matches this first and gives the result for all the other routes
// // app.use("/", (req, res) => {
// // res.send("hello from the dashboard");
// // });

// app.use("/", (err, req, res, next) => {
// if(err){
// res.status(500).send("Something went wrong")
// }
// });
