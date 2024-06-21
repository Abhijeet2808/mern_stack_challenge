const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/mernstackchallenge")
    .then(() => {
      console.log("Connected to Database!");
    })
    .catch(() => {
      console.log("Connection Failed!");
    });
};
module.exports = connectDB;
