//task

// NodeJs - Create User Registration & Login API using JWT token for User Verification
// ReactJs - Fetch data from Fake API, List down the Results, implement Pagination for the results

require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const cors = require("cors");

//app init and middleware
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
 .then(() => {
    //listening on port
    app.listen(process.env.PORT, () => {
        console.log("Connected to db");
        console.log(`Server is listening on port ${process.env.PORT}`);
    })
 })
 .catch((err) => {
    console.log(err);
 })