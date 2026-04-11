const express = require('express');
const app = express();
app.get('/profile', (req, res) => {
  // Login to my profile
  res.send('Get user profile');
});

app.put('/profile', (req, res) => {
  res.send('make updates');
});

module.exports = app;