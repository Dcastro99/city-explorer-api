'use strict';

const axios = require('axios');

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
    if (i === month) {
      return weatherArr[i];
    }
  }
};

const getWeather = async (req, res) => {
  const { lat, lon, searchQuery } = req.query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=7&lat=${lat}&lon=${lon}&city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`;
  const weatherList = await axios.get(url);

  const weather = weatherList.data.data.map((value) => {
    return new Forecast(value);
  });

  res.send(weather);
};

class Forecast {
  constructor(data) {
    this.date = changeDate(data.datetime);
    this.description = data.weather.description;
  }
}

module.exports = getWeather;
