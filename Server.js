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

app.get('/weather', getWeather);
app.get('/movies', getMovie);

app.get('*', (req, res) => {
  res.status(404).send('no, no ,no... superman no here...');
});

app.use('*', (error, response) => {
  response.status(500).send({ weatherError: error.message });
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
