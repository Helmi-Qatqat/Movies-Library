require("dotenv").config()
const express = require('express');
const server = express();
const port = process.env.PORT_KEY
const API_KEY = process.env.API_KEY
const cors = require('cors');
const Data = require('./Movie-Data/data.json');
const { default: axios } = require("axios");

server.use(cors());

function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date
  this.poster_path = poster_path;
  this.overview = overview
}

function errorHandler(req, res) {
  res.status(404).send('Page Not Found')
}


server.get("/", (req,res) => {
  res.status(200).send(new Movie(Data.title, Data.poster_path, Data.overview))
})



server.get("/favorite", (req, res) => {
  res.status(200).send('Welcome to Favorite Page')
})

server.get("/trending", async (req, res) => {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
  const moviesFromApi = await axios.get(url)
  const movie = moviesFromApi.data.results.map(
    (movie) => new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
  res.json(movie)
})

server.get(`/search`, async (req, res) => {
  let searchByName = req.query.name
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchByName}`
  const searchResult = await axios.get(url)
  const movie = searchResult.data.results.map(
    (movie) => new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
  res.json(movie)
})

server.get("/certification", async (req, res) => {
  const url = `https://api.themoviedb.org/3/certification/movie/list?api_key=${API_KEY}`
  const result = await axios.get(url)
  res.json(result.data)
})

server.get("/people", async (req, res) => {
  const personID = req.query.id
  const url = `https://api.themoviedb.org/3/person/${personID}?api_key=${API_KEY}&language=en-US`
  const result = await axios.get(url)
  res.json(result.data)
})

server.use((err, req, res) => {
  res.status(500).json({
    status: 500,
    responseText: "Sorry, something went wrong"
  });
});

server.get("*", errorHandler)

server.listen(port, () => {
	console.log(`server is listinging on port ${port}`) // Message to be displayed on terminal
})