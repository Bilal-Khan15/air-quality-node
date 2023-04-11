const cron = require('node-cron');
const air_quality = require('../api/cronjobs/air_quality');

cron.schedule('* * * * *', air_quality);