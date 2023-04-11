const _ = require('lodash');
const axios = require('axios');
const { Iqair, validate } = require('../models/iqair');
const config = require('config');

module.exports =  async (req, res) =>  {
    try {
        const response = await axios.get(
            config.get('localhost').concat("/api/pollution"),
            {
                params: {
                    "lon": config.get('defaultLongitude'),
                    "lat": config.get('defaultLatitude')
                }
            }
        );
        let iqair = new Iqair({
            datetime: Date.now(),
            city: config.get('defaultCity'),
            result: _.pick(response.data.Result.pollution, ["ts", "aqius", "mainus", "aqicn", "maincn"])
        });
        iqair = await iqair.save();
        console.log(iqair);
    }
    catch (error) {
        if (error.response) {
            console.log("WARNNING: Error air quality cron, air quality not saved / ErrorCode: " + error.response.status);
        } else{
            console.log("WARNNING: Request Error air quality cron");
        }
    }
};