const express = require('express');
const app = express();

app.get('/offers',(req,res) =>{
    res.send('choose the offer');
})

module.exports = app;