require("dotenv").config(); // Load .env first

const express = require("express");
const cors = require("cors");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL // Allow only your frontend
}));

// Connect to DB
initializeDatabase();

// ================= FUNCTIONS =================
async function readAllMovies() {
    try {
        return await Movie.find({});
    } catch (error) {
        throw error;
    }
}

async function readMovieByDirector(directorName) {
    try {
        return await Movie.find({ director: directorName });
    } catch (error) {
        throw error;
    }
}

async function readMovieByGenre(genreName) {
    try {
        return await Movie.find({ genre: genreName });
    } catch (error) {
        throw error;
    }
}

async function readMovieByTitle(title) {
    try {
        return await Movie.findOne({ title: title });
    } catch (error) {
        throw error;
    }
}

// ================= ROUTES =================
app.get("/", (req, res) => {
    res.send("Hello From Express");
});

app.get("/movies", async (req, res) => {
    try {
        const movies = await readAllMovies();
        movies.length
            ? res.json(movies)
            : res.status(404).json({ error: "No Movies Found" });
    } catch {
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

app.get("/movies/director/:directorName", async (req, res) => {
    try {
        const movies = await readMovieByDirector(req.params.directorName);
        movies.length
            ? res.json(movies)
            : res.status(404).json({ error: "No movies found" });
    } catch {
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

app.get("/movies/genres/:genreName", async (req, res) => {
    try {
        const movies = await readMovieByGenre(req.params.genreName);
        movies.length
            ? res.json(movies)
            : res.status(404).json({ error: "No movies found." });
    } catch {
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

app.get("/movies/:title", async (req, res) => {
    try {
        const movie = await readMovieByTitle(req.params.title);
        movie
            ? res.json(movie)
            : res.status(404).json({ error: "Movie Not Found" });
    } catch {
        res.status(500).json({ error: "Failed to fetch movie." });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
