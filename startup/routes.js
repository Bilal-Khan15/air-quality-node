const express = require('express');
const pollution = require('../api/routes/pollution');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/pollution', pollution);
  app.use(error);
}