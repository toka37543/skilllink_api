const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

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
        url: "http://localhost:3003",
        description: "Local development server"
      }
    ]
  },
  apis: [
    path.join(__dirname, "../docs/**/*.js"),
    path.join(__dirname, "../routes/**/*.js")
  ]
};

module.exports = swaggerJsdoc(options);
