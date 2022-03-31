'use strict';

const axios = require('axios');

const cache = require('./cache.js');

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

const getWeather = async (lat, lon, searchQuery) => {
  let key = '/weather' + searchQuery;

  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=7&lat=${lat}&lon=${lon}&city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`;

  if (cache[key] && Date.now() - cache[key].timestamp < 60000) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    const apiResponse = await axios.get(url);
    const weatherData = parseWeather(apiResponse.data);
    cache[key].data = weatherData;
    console.log(cache[key].data);
  }
  return cache[key];
};

const parseWeather = (weatherList) => {
  try {
    const weatherSummeries = weatherList.data.map(
      (value) => new Forecast(value)
    );
    return weatherSummeries;
    // return Promise.resolve(weatherSummeries);
  } catch (e) {
    return Promise.reject(e);
  }
};

class Forecast {
  constructor(data) {
    this.date = changeDate(data.datetime);
    this.description = data.weather.description;
  }
}

module.exports = getWeather;
