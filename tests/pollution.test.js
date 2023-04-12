const request = require('supertest');
const {Iqair} = require('../api/models/iqair');
const mongoose = require('mongoose');

let server;

describe('/api/pollution', () => {
  beforeEach(() => { server = require('../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Iqair.deleteMany({})
  });

  describe('GET /', () => {
    it('should return status 200', async () => {
      const res = await request(server)
        .get('/api/pollution?lat=48.856613&lon=2.352222');
  
      expect(res.status).toBe(200);
    });
  });

  describe('GET /max', () => {
    it('should return most polluted date & time for paris', async () => {
      const iqairs = [
        {
          "datetime": new Date(),
          "city": "karachi",
          "result": {
              "ts": new Date(),
              "aqius": 35,
              "mainus": "p2",
              "aqicn": 52,
              "maincn": "o3"
          },
        },
        {
          "datetime": new Date(new Date().getTime()+(5*24*60*60*1000)),
          "city": "paris",
          "result": {
              "ts": new Date(new Date().getTime()+(5*24*60*60*1000)),
              "aqius": 31,
              "mainus": "p2",
              "aqicn": 22,
              "maincn": "o3"
          },
        },
      ];
      
      await Iqair.collection.insertMany(iqairs);

      const res = await request(server).get('/api/pollution/max');
    
      var today = new Date().toJSON().slice(0,10);
  
      expect(res.status).toBe(200);
      expect(res.body.date === today).toBeTruthy();
    });
  });

  describe('POST /', () => {

    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/pollution')
        .send({ datetime, city, result });
    }

    beforeEach(() => {
      datetime = Date.now();
      city = 'paris';
      result = {
        ts: Date.now(),
        aqius: 31,
        mainus: "p2",
        aqicn: 22,
        maincn: "o3"
      }
    })

    it('should return 400 if data is invalid', async () => {
      city = ''; 

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if city is less than 2 characters', async () => {
      city = '1'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      city = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the iqair if it is valid', async () => {
      await exec();

      const iqair = await Iqair.find({ city: 'paris' });

      expect(iqair).not.toBeNull();
    });

    it('should return the iqair if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('city', 'paris');
    });
  });
});