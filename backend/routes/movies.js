// backend/routes/movies.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  listMovies,
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";

const router = express.Router();

// public list
router.get("/", listMovies);

// get single
router.get("/:id", getMovie);

// add movie (protected)
router.post("/", auth, addMovie);

// update (protected)
router.put("/:id", auth, updateMovie);

// delete (protected)
router.delete("/:id", auth, deleteMovie);

export default router;
