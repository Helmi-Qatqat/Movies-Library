require("dotenv").config()
const express = require('express');
const server = express();
const port = process.env.PORT_KEY
const API_KEY = process.env.API_KEY
const cors = require('cors');
const Data = require('./Movie-Data/data.json')

server.use(cors());

function Movie(title, poster_path, overview) {
  this.title = title;
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

server.get('/crash', (req, res) => {
  throw new Error('Server crash');
});

server.use((err, req, res, next) => {
  res.status(500).json({
    status: 500,
    responseText: "Sorry, something went wrong"
  });
});

server.get("*", errorHandler)

server.listen(port, () => {
	console.log(`server is listinging on port ${port}`) // Message to be displayed on terminal
})