const _ = require('lodash');
const axios = require('axios');
const { Iqair, validate } = require('../models/iqair');
const config = require('config');

module.exports =  async (req, res) =>  {
    try {
        const response = await axios.post(
            config.get('localhost').concat("/api/pollution"),
            {
                lat: config.get('defaultLatitude'),
                lon: config.get('defaultLongitude')
            }
        );
        console.log(response.data);
    }
    catch (error) {
        if (error.response) {
            console.log("WARNNING: Error air quality cron, air quality not saved / ErrorCode: " + error.response.status);
        } else{
            console.log("WARNNING: Request Error air quality cron");
        }
    }
};