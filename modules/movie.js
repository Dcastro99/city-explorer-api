'use strict';

const axios = require('axios');

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

module.exports = getMovie;
