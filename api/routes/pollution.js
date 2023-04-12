const _ = require('lodash');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Iqair } = require('../models/iqair');
const validate = require("../../middleware/validate");
const config = require('config');

router.get('/', async (req, res) => {
    try {
        const body = await getAqi(req.query.lat, req.query.lon);

        res.send({
            "Result": {
                "pollution": body.data.current.pollution
            }
        });
    } catch (err) {
        if (err.response){
            res.status(400).send({
                "message": err.response.data.data.message
            });
        }else{
            res.status(500).send({
                "message": "Somthing faild on the server."
            });
        }
    }
});

router.get('/max', async (req, res) => {
    const aqius = await Iqair.find({}).sort({ 'result.aqius': -1 }).limit(1).then(aqi => aqi[0].datetime);
    
    const dateTime = new Date(aqius).toISOString().split("T")

    res.send({
        "date": dateTime[0],
        "time": dateTime[1]
    });
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const response = await getAqi(req.body.lat, req.body.lon);

        let iqair = new Iqair({
            datetime: Date.now(),
            city: config.get('defaultCity'),
            result: _.pick(response.data.current.pollution, ["ts", "aqius", "mainus", "aqicn", "maincn"])
        });
        await iqair.save();
    
        res
        .send(_.pick(iqair, ["_id", "datetime", "city", "result"]));
    }
    catch (error) {
        if (error.response) {
            console.log("ERROR: air quality not saved / ErrorCode: " + error.response.status);
        } else{
            console.log("WARNNING: Request Error air quality");
        }
    }

});

async function getAqi(latitude, longitude) {
    const response = await axios.get(
        config.get('api'),
        {
            params: {
                lat: latitude,
                lon: longitude,
                key: config.get('apiKey')
            }
        }
    );

    return response.data;
}

module.exports = router;