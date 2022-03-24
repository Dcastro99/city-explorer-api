'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());

const PORT = process.env.PORT || 'NOPE!!';

app.get('/', (request, response) => {
  response.send('hello from the route!!!');
});

let weatherArr = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let changeDate = (date) => {
  const newDate = date.split('-');
  let month = changeMonth(newDate[1]);
  let day = newDate[2];
  let year = newDate[0];
  return `${month} ${day}, ${year}`;
};

let changeMonth = (month) => {
  for (let i = 1; i < weatherArr.length + 1; i++) {
    if (i == month) {
      return weatherArr[i];
    }
  }
};

const getWeather = async (req, res) => {
  const { lat, lon, searchQuery } = req.query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  const weatherList = await axios.get(url);

  const weather = weatherList.data.data.map((value) => {
    return new Forecast(value);
  });
  console.log(weather);
  res.send(weather);
};

class Forecast {
  constructor(data) {
    this.date = changeDate(data.datetime);
    this.description = data.weather.description;
  }
}

app.get('/weather', getWeather);

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use((error, request, response, next) => {
  response.status(500).send({ weatherError: error.message });
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
