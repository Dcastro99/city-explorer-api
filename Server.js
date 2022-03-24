'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const weatherList = require('./data/weather.json');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 'NOPE!!';

class Forecast {
  constructor(data) {
    this.date = data.datetime;
    this.description = data.weather.description;
  }
}

app.get('/', (request, response) => {
  response.send('hello from the route!!!');
});

// this method to be used for async weather api, becasue we are using `next`
app.get('/weatherNew', (req, res, next) => {
  const { lat, lon, searchQuery } = req.query;
  try {
    // API stuff would go here.
    const results = weatherList.find(
      (cityInfo) =>
        (cityInfo.lat === lat && cityInfo.lon === lon) ||
        cityInfo.city_name.toLowerCase() === searchQuery.toLowerCase()
    );
    const toSend = results.data.map((forecast) => new Forecast(forecast));
    res.send(toSend);
  } catch (error) {
    next(new Error('No weather here sucka!'));
  }
});

app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  const results = weatherList.find(
    (cityInfo) =>
      (cityInfo.lat === lat && cityInfo.lon === lon) ||
      cityInfo.city_name.toLowerCase() === searchQuery.toLowerCase()
  );

  // res.send('My Crazy Weather!!');
  if (results) {
    const toSend = results.data.map((forecast) => new Forecast(forecast));
    res.send(toSend);
  } else {
    throw new Error('No weather here sucka!');
  }
});

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use((error, request, response, next) => {
  response.status(500).send({ weatherError: error.message });
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
