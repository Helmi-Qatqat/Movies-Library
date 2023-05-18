'use strict';
require("dotenv").config()
const express = require('express');
const server = express();
const cors = require('cors');
const Data = require('./Movie-Data/data.json');
const axios = require("axios");
const pg = require("pg")
const client = new pg.Client(process.env.DATABASE_URL)
const port = process.env.PORT_KEY
const API_KEY = process.env.API_KEY

server.use(cors());
server.use(express.json())


function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

function errorHandler(req, res) {
  res.status(404).send('Page Not Found')
}

async function addMovie(req,res) {
  const movie = req.body;
  console.log(movie)
  const sql = `INSERT INTO movies_lists (id, title, release_date, poster_path, overview)
  VALUES ('${movie.id}', '${movie.title}', '${movie.release_date}', '${movie.poster_path}', '${movie.overview}');`
  await client.query(sql)
}

function getAllMovies(req,res) {
  const sql = `SELECT * FROM movies_lists;`
  client.query(sql).then((data) => res.send(data.rows))
}


function getMovie (req, res) {
  const paramId = req.params.id
  const sql = `SELECT * FROM movies_lists WHERE id = ${paramId};`
  client.query(sql).then((data) => res.status(200).send(data))
}

function deleteMovie (req, res) {
  const paramId = req.params.id 
  const sql = `DELETE FROM movies_lists WHERE id = ${paramId};`
  client.query(sql)
  .then(() => res.status(204).json(`Data successfully Deleted`))
}

async function updateMovie (req, res) {
  const paramId = req.params.id
  const data = req.body.comment
  const sql = `UPDATE movies_lists SET comment = '${data}' WHERE id = ${paramId};`
  await client.query(sql)
}

server.get("/getMovie/:id", getMovie)

server.delete("/movie/:id", deleteMovie)

server.put("/movie/:id", updateMovie)

server.post("/add", addMovie)

server.get("/getMovies", getAllMovies)

server.get("/", (req,res) => {
  res.status(200).send({title: Data.title, poster_path: Data.poster_path, overview: Data.overview})
})

server.get("/favorite", (req, res) => {
  const sql = `SELECT * FROM movies_lists`
  client.query(sql).then(data => res.json(data.rows))
})


server.get("/trending", async (req, res) => {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
  const moviesFromApi = await axios.get(url)
  const movies = moviesFromApi.data.results.map(
    (movie) => new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
  res.json(movies)
})

server.get(`/search`, async (req, res) => {
  let searchByName = req.query.name
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchByName}`
  const searchResult = await axios.get(url)
  const movies = searchResult.data.results.map(
    (movie) => new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
  res.json(movies)
})

server.get("/certification", async (req, res) => {
  const url = `https://api.themoviedb.org/3/certification/movie/list?api_key=${API_KEY}`
  const result = await axios.get(url)
  res.json(result.data.certifications)
})

server.get("/people", async (req, res) => {
  const personID = req.query.id
  const url = `https://api.themoviedb.org/3/person/${personID}?api_key=${API_KEY}&language=en-US`
  const result = await axios.get(url)
  res.json(result.data)
})

server.get('/crash', (req, res, next) => {
  throw new Error('Server crash');
});

server.use((err, req, res) => {
  res.status(500).json({
    status: 500,
    responseText: "Sorry, something went wrong"
  });
});

server.get("*", errorHandler)

client.connect().then(
  server.listen(port, () => {
    console.log(`server is listening on port ${port}`) // Message to be displayed on terminal
  })
)