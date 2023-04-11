const config = require('config');

module.exports = function() {
  if (!config.get('apiKey')) {
    throw new Error('FATAL ERROR: apiKey is not defined.');
  }
}