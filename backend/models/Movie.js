// backend/models/Movie.js
import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: String,
  imdbId: String,
  genre: [String],          // array of genres
  description: String,
  poster: String,
  resolutions: {            // direct links
    p480: { type: String, default: "" },
    p720: { type: String, default: "" },
    p1080: { type: String, default: "" }
  },
  qualities: {              // keep qualities object too (optional)
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
