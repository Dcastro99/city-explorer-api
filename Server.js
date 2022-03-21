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
  response.send('hellow from the route!!!');
});

app.get('/weather', (req, res, next) => {
  const { lat, lon, searchQuery } = req.query;

  const results = weatherList.find(
    (cityInfo) =>
      (cityInfo.lat === lat && cityInfo.lon === lon) ||
      cityInfo.city_name.toLocaleLowerCase() === searchQuery.toLocaleLowerCase()
  );

  // res.send('My Crazy Weather!!');
  if (results) {
    const toSend = results.data.map((forecast) => new Forecast(forecast));
    res.send(toSend);
  } else {
    next(new Error('No weather here sucka!'));
  }
});

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use((error, request, response) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
