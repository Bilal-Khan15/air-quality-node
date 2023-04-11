const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Iqair } = require('../models/iqair');
const validate = require("../../middleware/validate");
const config = require('config');

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            config.get('api'),
            {
                params: {
                    lat :req.query.lat,
                    lon: req.query.lon,
                    key: config.get('apiKey')
                }
            }
        );
        const body = response.data;
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
    const aqius = await Iqair.findOne({city: config.get('defaultCity')}).select('datetime -_id').sort('-result.aqius').limit(1);
    const dateTime = new Date(aqius.datetime).toISOString().split("T")

    res.send({
        "date": dateTime[0],
        "time": dateTime[1]
    });
});

router.post("/", [validate(validateIqair)], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    iqair = new Iqair(_.pick(req.body, ["datetime", "city", "result"]))
        .select('datetime -_id')
        .sort('-result.aqius')
        .limit(1);
    await iqair.save();
  
    res
      .send(_.pick(iqair, ["_id", "datetime", "email", "result"]));
});

function validateIqair(req) {
    const schema = {
        datetime: Joi.date()
            .required(),
        city: Joi.string()
            .min(2)
            .max(50)
            .required(),
        result: Joi.object
            .required()
    };
  
    return Joi.validate(iqair, schema);
}

module.exports = router;