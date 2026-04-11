const express = require("express");
const app = express();

// GET /
app.get("/", function (req,res) {
       
    res.end("Hello World");
});

module.exports = app;

