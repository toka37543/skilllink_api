const express = require('express');
const db = require("../lib/db")
const joi = require("joi")
const app = express();
const bcrypt = require("bcrypt");
const authController = require("../controllers/authController");
const passwordController = require("../controllers/passwordController");


app.post('/auth/login', authController.login);


app.post('/auth/register', async (req, res) => {  
  // skip 
  const schema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    type: joi.string().valid("user", "client").required(),
    country_code: joi.string().optional(),
    phone_number: joi.string().optional(),
    company_name: joi.when("type", {
      is: "client",
      then: joi.string().optional(),
      otherwise: joi.forbidden()
    }),
    company_details: joi.when("type", {
      is: "client",
      then: joi.string().optional(),
      otherwise: joi.forbidden()
    })
  })
  
  const validation = schema.validate(req.body)
  if (validation.error) {
    res.status(400).send({
      success: false,
      message: validation.error.message
    })
    return;
  }

  const body = validation.value;
  
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    let query;
    let params;

    if (body.type === "client") {
      query = "INSERT INTO clients (first_name, last_name, email, password, country_code, phone_number, company_name, company_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      params = [
        body.first_name,
        body.last_name,
        body.email,
        hashedPassword,
        body.country_code ?? null,
        body.phone_number ?? null,
        body.company_name ?? null,
        body.company_details ?? null
      ];
    } else {
      query = "INSERT INTO users (first_name, last_name, email, password, country_code, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
      params = [
        body.first_name,
        body.last_name,
        body.email,
        hashedPassword,
        body.country_code ?? null,
        body.phone_number ?? null
      ];
    }

    const result = await db.execute(query, params);
    
    const data = { ...body };
    delete data.password; // remove password from response

    return res.status(200).send({
      success: true,
      message: `${body.type === "client" ? "Client" : "User"} registered successfully`,
      data: {
        id: result[0].insertId,
        ...data
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


app.post('/auth/forget-password', passwordController.forgetPassword);

app.post('/auth/reset-password', passwordController.resetPassword);

module.exports = app;
