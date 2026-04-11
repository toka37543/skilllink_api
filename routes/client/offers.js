const express = require('express')
const app = express();

app. post('/client/offers',(req , res) =>{
    res.send('post an offer')
})

module.exports=app;