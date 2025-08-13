require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { initializeDatabase } = require("../db/db.connect");
const Movie = require("../models/movie.models");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true, optionsSuccessStatus: 200 }));

// Connect DB
initializeDatabase();

// Helper functions
async function readAllMovies() {
  return await Movie.find({});
}
async function readMovieByDirector(directorName) {
  return await Movie.find({ director: directorName });
}
async function readMovieByGenre(genreName) {
  return await Movie.find({ genre: genreName });
}
async function readMovieByTitle(title) {
  return await Movie.findOne({ title });
}

// Routes
app.get("/", (req, res) => {
  res.send("🎬 Welcome to Movies API");
});

app.get("/movies", async (req, res) => {
  const movies = await readAllMovies();
  movies.length
    ? res.json(movies)
    : res.status(404).json({ error: "No Movies Found" });
});

app.get("/movies/director/:directorName", async (req, res) => {
  const movies = await readMovieByDirector(req.params.directorName);
  movies.length
    ? res.json(movies)
    : res.status(404).json({ error: "No movies found" });
});

app.get("/movies/genres/:genreName", async (req, res) => {
  const movies = await readMovieByGenre(req.params.genreName);
  movies.length
    ? res.json(movies)
    : res.status(404).json({ error: "No movies found." });
});

app.get("/movies/:title", async (req, res) => {
  const movie = await readMovieByTitle(req.params.title);
  movie
    ? res.json(movie)
    : res.status(404).json({ error: "Movie Not Found" });
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
