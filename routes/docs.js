const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../lib/swagger");

const app = express();

app.get("/docs.json", (req, res) => {
  res.send(swaggerSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
