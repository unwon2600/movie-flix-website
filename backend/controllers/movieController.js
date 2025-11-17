// backend/controllers/movieController.js
import Movie from "../models/Movie.js";
import axios from "axios";

/**
 * GET /api/movies  -> list all
 * POST /api/movies -> add (protected)
 * GET /api/movies/:id -> single
 * PUT /api/movies/:id -> update (protected)
 * DELETE /api/movies/:id -> delete (protected)
 */

export const listMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.json(movies);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const m = await Movie.findById(id);
    if (!m) return res.status(404).json({ error: "Not found" });
    return res.json(m);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addMovie = async (req, res) => {
  try {
    const { title, qualities = {}, genres = [] } = req.body || {};
    if (!title) return res.status(400).json({ error: "Missing title" });

    // fetch OMDb safe
    let omdbData = {};
    if (process.env.IMDB_API_KEY) {
      try {
        const r = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.IMDB_API_KEY}`);
        omdbData = r.data || {};
      } catch (err) {
        console.warn("OMDb fetch failed:", err.message);
      }
    }

    const movie = {
      title: omdbData.Title || title,
      imdbId: omdbData.imdbID || "",
      genre: (omdbData.Genre && omdbData.Genre.split(",").map(s=>s.trim())) || genres,
      description: omdbData.Plot || "",
      poster: (omdbData.Poster && omdbData.Poster !== "N/A") ? omdbData.Poster : "",
      resolutions: {
        p480: qualities["480p"] ? qualities["480p"].direct || "" : "",
        p720: qualities["720p"] ? qualities["720p"].direct || "" : "",
        p1080: qualities["1080p"] ? qualities["1080p"].direct || "" : ""
      },
      createdAt: new Date()
    };

    const doc = await Movie.create(movie);
    return res.json({ success: true, movie: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    await Movie.findByIdAndUpdate(id, body, { new: true });
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};
