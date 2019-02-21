const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const IP = process.env.IP;
const users = require("./routes/api/user");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const app = express();

//DB config
const db = require("./config/keys").mongoURI;

//Connect to DB, returns promise so need to use .then and .catch
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World"));

//Use routes
app.use("/api/users", users); //send to users.js
app.use("/api/profiles", profiles); //send to profiles.js
app.use("/api/posts", posts); //send to posts.js

app.listen(port, () => console.log(`Running server on port ${port}`));
