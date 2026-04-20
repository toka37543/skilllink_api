const path = require("path");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");

const apiUrl = process.env.API_URL || "http://localhost:3003";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillLink API",
      version: "1.0.0",
      description: "Swagger documentation for the SkillLink API"
    },
    servers: [
      {
        url: apiUrl,
        description: "Configured API server"
      }
    ]
  },
  apis: [
    path.join(__dirname, "../docs/**/*.js"),
    path.join(__dirname, "../routes/**/*.js")
  ]
};

module.exports = swaggerJsdoc(options);
