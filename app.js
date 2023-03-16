const express = require("express");
const userRoutes = require("./api/routes/users");

const bodyParser = require("body-parser");
const itemRoutes = require("./api/routes/items");
const mongoose = require("mongoose");
const cors = require('cors')

mongoose.connect("mongodb://127.0.0.1:27017/bidsite");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

app.use((req, res) => {
  const error = new Error();

  res.status(500).json({
    error: error,
  });
});

module.exports = app;
