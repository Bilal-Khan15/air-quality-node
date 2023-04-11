# AIR QUALITY
Building REST API using Node Js.

## Introduction

This project is the backend of Air Quality to create a REST API responsible for exposing “the air quality information” of a nearest city to GPS coordinates using iqair :
https://www.iqair.com/fr/commercial/air-quality-monitors/airvisual-platform/api

This is the implementation of Air Quality in Node.js.

## Setup

Please follow all these steps as explained below.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Start the Server

    node index.js

This will launch the Node server on port 3000. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3000/api/pollution?lat=5&lon=8
params: longitude, latitude.

You should get “air quality “ for the given zone. That confirms that you have set up everything successfully.

### Environment Variables

If you look at config/default.json, you'll see a property called apiKey. This key is used to fetch “air quality “ with iqair URL.  So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier to get up and running with this project. For a production scenario, this key should be stored as an environment variable.

### CRON

There's implemented a CRON JOB to check "air quality" for the Paris zone ( latitude: 48.856613 ,longitude: 2.352222) every 1 minute and than saved in the database. 
Based on thid CRON JOB results, an endpoint is added to get datetime( date and time ) where the paris zone is the most polluted.

http://localhost:3000/api/pollution/max