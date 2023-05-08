require("dotenv").config()
const express = require('express');
const server = express();
const port = process.env.PORT_KEY
const API_KEY = process.env.API_KEY
const cors = require('cors');
const Data = require('./Movie-Data/data.json');
const axios = require("axios");
const pg = require("pg")
const client = new pg.Client(process.env.DATABASE_URL)

server.use(cors());
server.use(express.json())

function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview
}

function errorHandler (req, res) {
  res.status(404).send('Page Not Found')
}

function addMovie (req, res) {
  const movie = req.body;
  const sql = `INSERT INTO movies_lists (title, poster_path, overview)
  VALUES ('${movie.title}','${movie.poster_path}', '${movie.overview}');`
  client.query(sql).then(() => res.send('added succesfully'))
}

function getMovies (req, res) {
  const sql = `SELECT * FROM movies_lists;`
  client.query(sql).then((data) => res.send(data.rows))
}

function deleteMovie (req, res) {
  
}

function updateMovie (req, res) {

}

function getTheMovie (req, res) {

}

server.post("/add", addMovie)
server.get("/getMovies", getMovies)
server.get("/getMovie/:id", getTheMovie)
server.delete("/movie/:id", deleteMovie)
server.put("/movie/:id", updateMovie)

server.get("/", (req,res) => {
  res.status(200).send(new Movie(Data.title, Data.poster_path, Data.overview))
})

server.get("/favorite", (req, res) => {
  res.status(200).send('Welcome to Favorite Page')
})

server.post("/")

server.get("/trending", async (req, res) => {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
  const moviesFromApi = await axios.get(url)
  res.json(moviesFromApi.data)
})

server.get(`/search`, async (req, res) => {
  let searchByName = req.query.name
  console.log(searchByName)
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchByName}`
  const searchResult = await axios.get(url)
  res.json(searchResult.data)
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

client.connect().then(
  server.listen(port, () => {
    console.log(`server is listinging on port ${port}`) // Message to be displayed on terminal
  })
)