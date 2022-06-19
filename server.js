const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config(); // this provide

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.REACT_APP_PORT, function() {
  console.log(`Socially:ON User panel listening on port ${process.env.REACT_APP_PORT}`);
  // node process 
});