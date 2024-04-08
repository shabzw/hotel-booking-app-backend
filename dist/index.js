"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json());
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "*"
}));
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to database"));
app.get("/health", async (req, res) => {
  res.send({
    message: "Health OK!"
  });
});
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/account/", require("./routes/account"));
app.listen(4000, () => {
  console.log("Server started on localhost:4000");
});
