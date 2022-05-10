// Require express module
var express = require("express");
var cors = require('cors')
var app = express();
app.use(cors())
// Require body-parser module
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Require mongoose module
var mongoose = require("mongoose");

// Require dotenv module
require("dotenv").config();

// Using dotenv
var user = process.env.MONGO_USERID
var pw = process.env.MONGO_PW

// Database uri
const uri = "mongodb+srv://" + user + ":" + pw + "@cluster0.r8rdt.mongodb.net/f1data?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const Driver = mongoose.model(
  "Driver",
  {
    name: String,
    birthyear: Number,
    country: String,
    latestconstructor: String
  },
  "f1drivers"
)


// Search all drivers
app.get("/api/drivers", function (req, res) {

  Driver.find({}, null, function (err, results) {
    if (err) {
      res.status(500).json("Fault in data search");
    } else {
      console.log(results);
      res.status(200).json(results);
    };
  });
});

// Search for driver by id
app.get("/api/:id", function (req, res) {
  var id = req.params.id;
  Driver.findById(id, function (err, results) {
    // Error handling
    if (err) {
      res.status(500).json("Fault in data search");
    } else {
      console.log(results);
      res.status(200).json(results);
    };
  });
});

// Adding a driver
app.post("/api/add", function (req, res) {
  var newDriver = new Driver({
    name: req.body.name,
    birthyear: req.body.birthyear,
    country: req.body.country,
    latestconstructor: req.body.latestconstructor
  });
  newDriver.save(function (err, user) {
    // Error handling
    if (err) return console.log(err);
    console.log(user)
  });
  res.send("Added Driver: " + req.body.name);
});


// Updating by id
app.put("/api/update/:id", function (req, res) {
  var id = req.params.id;

  Driver.findByIdAndUpdate(id, {
    name: req.body.name, birthyear: req.body.birthyear,
    country: req.body.country,
    latestconstructor: req.body.latestconstructor
  }, function (err, results) {
    // Error handling
    if (err) {
      console.log(err);
      res.status(500).json("Fault in update operation.");
    }
    else if (results == null) {
      res.status(200).json("Cannot be updated as object cannot be found.");
    }
    else {
      console.log(results);
      res.status(200).json("Updated " + id + " " + results.name);
    }
  });

});

// Deleting by id
app.delete("/api/delete/:id", function (req, res) {
  var id = req.params.id;

  Driver.findByIdAndDelete(id, function (err, results) {
    // Error handling
    if (err) {
      console.log(err);
      res.status(500).json("Fault in delete operation.");
    }
    else if (results == null) {
      res.status(200).json("Cannot be deleted as object cannot be found.");
    }
    else {
      console.log(results);
      res.status(200).json("Deleted " + id + " " + results.name);
    }
  });
});


// Express server
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("Example app is listening on port %d", PORT);
});