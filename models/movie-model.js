const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieName: String,
    seen: String,
    userID: String,
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
