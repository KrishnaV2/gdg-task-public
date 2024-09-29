const express = require("express");
const { validUser } = require("../../controllers/authController");
const { deleteMovie, editMovie, addMovie, getMovies, getMovieByUser, getMovie } = require("../../controllers/movieController");
const router = express.Router()

router.use(validUser)
router.route('/bulk').get(getMovies) // pagination here
router.route('/').post(addMovie)
router.get('/user', getMovieByUser)
router.route('/:movieId').get(getMovie).put(editMovie).delete(deleteMovie);

module.exports = router