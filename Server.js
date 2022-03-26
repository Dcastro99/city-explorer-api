'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());

const PORT = process.env.PORT || 3002;

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
    if (i === month) {
      return weatherArr[i];
    }
  }
};

const getWeather = async (req, res) => {
  const { lat, lon, searchQuery } = req.query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?days=7&lat=${lat}&lon=${lon}&city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`;
  const weatherList = await axios.get(url);
  console.log(weatherList);
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

const getMovie = async (req, res) => {
  const movieChosen = req.query.searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&laguage=en-US&query=${movieChosen}`;
  try {
    const movieList = await axios.get(url);
    const movieData = movieList.data.results.map((value) => {
      return new Movie(value);
    });
    res.send(movieData);
  } catch (error) {
    throw new Error(error.message);
  }
};

const baseImageUrl = 'https://image.tmdb.org/t/p/w500/';

class Movie {
  constructor(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.average_votes = data.vote_average;
    this.total_votes = data.vote_count;
    this.image_url = baseImageUrl + data.poster_path;
    this.popularity = data.popularity;
    this.released_on = data.release_date;
  }
}

app.get('/weather', getWeather);
app.get('/movies', getMovie);

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use('*', (error, response) => {
  response.status(500).send({ weatherError: error.message });
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
