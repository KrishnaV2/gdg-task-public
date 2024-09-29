const Movies = require("../models/movieModel");
const User = require("../models/userModel");

exports.getMovies = async function (req, res) {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const filter = req.query.filter;
        const skip = (page - 1) * limit;
        const totalDocs = await Movies.countDocuments();
        if (skip >= totalDocs) return res.status(404).json({ "status": "fail", "message": "Page does not exist" })
        let movies;
        if (filter) movies = await Movies.find({ title: { '$regex': `${filter}`, $options: 'i' } }).skip(skip).limit(limit)
        else movies = await Movies.find().skip(skip).limit(limit)
        return res.status(200).json({ "status": "success", total: totalDocs, "data": movies })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}
exports.getMovie = async function (req, res) {
    try {
        const { movieId } = req.params;
        if (!movieId)
            return res.status(400).json({ "status": "fail", "message": "Movie ID Missing" })
        const movie = await Movies.findById({ _id: movieId });
        if (!movie) return res.status(400).json({ "status": "fail", "message": "Movie does not exist" });
        return res.status(200).json({ "status": "success", data: movie });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}
exports.getMovieByUser = async function (req, res) {
    try {
        const userId = req.userId;
        // console.log(userId)
        if (!userId) return res.status(400).json({ "status": "fail", "message": "User ID is missing" })
        const user = await User.findById({ _id: userId })
        if (!user) return res.status(400).json({ "status": "fail", "message": "User does not exist" })
        const movies = await Movies.find({ userId });
        if (!movies) return res.status(400).json({ "status": "fail", "message": "User has submitted no movies" })
        return res.status(200).json({ "status": "success", "data": movies })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Error" })
    }
}
exports.addMovie = async function (req, res) {
    try {
        const { title, genre, rating, releaseDate, description, posterUrl } = req.body;
        // console.log(title, genre, rating, releaseDate, description, posterUrl)
        const userId = req.userId;
        if (!title || !genre || !releaseDate || !description || !posterUrl)
            return res.status(400).json({ "status": "fail", "message": "Fill all input fields" })
        const finalRating = rating ?? 0;
        // check if movie exists with same name and release date
        const movie = await Movies.create({ title, genre, releaseDate, description, rating: finalRating, posterUrl, userId });
        return res.status(201).json({ "status": "success", data: movie });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}
exports.editMovie = async function (req, res) {
    try {
        const { title, genre, rating, releaseDate, description, posterUrl, userId } = req.body;
        if (!title || !genre || !releaseDate || !description || !posterUrl || !userId)
            return res.status(400).json({ "status": "fail", "message": "Fill all input fields" })
        const { movieId } = req.params;
        if (!movieId)
            return res.status(400).json({ "status": "fail", "message": "Invalid Movie ID" })
        const movie = await Movies.findByIdAndUpdate({ _id: movieId }, { title, genre, rating, releaseDate, description, posterUrl, userId });
        if (!movie) return res.status(400).json({ "status": "fail", "message": "Movie does not exist" });
        return res.status(201).json({ "status": "success", data: movie });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}
exports.deleteMovie = async function (req, res) {
    try {
        const userId = req.userId;
        const { movieId } = req.params;
        if (!movieId)
            return res.status(400).json({ "status": "fail", "message": "Invalid Movie ID" })
        const movie = await Movies.findOneAndDelete({ _id: movieId, userId });
        // console.log(movie);
        if (!movie) return res.status(400).json({ "status": "fail", "message": "You are NOT Authorized or Movie does not exist" })
        return res.status(200).json({ "status": "success", "message": "Movie Successfully Deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}