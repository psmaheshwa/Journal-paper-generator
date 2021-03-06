const express = require('express');
const generatorRouter = express.Router();
const { downloadPDF, generatePDF } = require("../controller/generatorController");



generatorRouter.route('/')
  .get(downloadPDF)
  .post(generatePDF);

module.exports = generatorRouter;
