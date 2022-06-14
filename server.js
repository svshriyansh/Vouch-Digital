const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-Parser");
require("dotenv").config();
const { dbuser, dbPassword } = process.env;
const url = `mongodb+srv://${dbuser}:${dbPassword}@cluster0.gpzb5.mongodb.net/Addressbook`;
PORT = 8000;

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected...");
    },
    (err) => {
      console.log("Error found", err);
    }
  );
app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Server connected on ${PORT}`);
});
