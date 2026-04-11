const express = require('express');
const db = require("../lib/db")
const joi = require("joi")
const app = express();
const crypto = require("crypto");
const bcrypt = require("bcrypt");


app.post('/auth/login',async (req, res) => {
  // Login to my profile
  res.send('Get my profile');
});


app.post('/auth/register', async (req, res) => {  
  const body = req.body;
  
  // skip 
  const schema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    type: joi.string().valid("user", "client").required(),
    country_code: joi.string().optional(),
    phone_number: joi.string().optional()
  })
  
  const validation = schema.validate(body)
  if (validation.error) {
    res.status(400).send({
      success: false,
      message: validation.error.message
    })
    return;
  }
  
  try {
    const query = "INSERT INTO users (first_name, last_name, email, password, country_code, phone_number, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    // const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex');
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const result = await db.execute(query, [
      body.first_name,
      body.last_name,
      body.email,
      hashedPassword,
      body.country_code ?? null,
      body.phone_number ?? null,
      body.type
    ]);
    
    delete body.password; // remove password from response
    return res.status(200).send({
      success: true,
      message: "User registered successfully",
      data: {
        id: result[0].insertId,
        ...body
      }
    })
  } catch (err) {
    // handle the err
    res.status(400).send({
      success: false,
      message: err.message,      
    })
  }
});


app.post('/auth/reset-password', (req, res) => {
  res.send(`get a new passoword`);
});

module.exports = app;