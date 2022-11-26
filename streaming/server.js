const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
  
  
});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});