'use strict';

const axios = require('axios');
const cache = require('./cache.js');

const getMovie = async (searchQuery) => {
  let key = '/movie' + searchQuery;
  console.log(key);
  const movieChosen = searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&laguage=en-US&query=${movieChosen}`;

  if (cache[key] && Date.now() - cache[key].timestamp < 180000) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    const apiResponse = await axios.get(url);
    const movieData = parseMovie(apiResponse.data.results);
    cache[key].data = movieData;
    console.log(cache[key].data);
  }

  return cache[key];
};

const parseMovie = (movieList) => {
  try {
    const movieSummeries = movieList.map((value) => new Movie(value));

    return movieSummeries;
  } catch (e) {
    return Promise.reject(e);
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

module.exports = getMovie;
