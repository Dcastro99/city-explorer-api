'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const getWeather = require('./modules/weather.js');
const getMovie = require('./modules/movie.js');

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('hello from the route!!!');
});

app.get('/movies', movieHandler);
app.get('/weather', weatherHandler);

async function weatherHandler(request, response) {
  const { lat, lon, searchQuery } = request.query;
  try {
    const summaries = await getWeather(lat, lon, searchQuery);
    response.send(summaries);
  } catch (error) {
    console.error(error);
    response.status(500).send('Sorry. Something went wrong fetching weather!');
  }
}

async function movieHandler(request, response) {
  const { searchQuery } = request.query;
  try {
    const summaries = await getMovie(searchQuery);
    response.send(summaries);
  } catch (error) {
    console.error(error);
    response.status(500).send('Sorry. Something went wrong fetching movies!');
  }
}

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use('*', (error, response) => {
  response.status(500).send({ weatherError: error.message });
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
