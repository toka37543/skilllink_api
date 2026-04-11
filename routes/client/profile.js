const express = require('express');
const app = express();
app.get('/profile', (req, res) => {
  res.send('Get client profile');
});

app.put('/profile', (req, res) => {
  
  res.send('make updates');
});

module.exports = app;