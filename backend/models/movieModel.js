const mongoose = require("mongoose")

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A Movie Title is required"],
    },
    genre: {
        type: [String],
        enum: ['Action', 'Drama', 'Horror', 'Thriller', 'History', 'Mystery', 'Adventure', 'Sci-Fi'],
        required: [true, "Enter atleast one genre"],
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    releaseDate: {
        type: Date,
        required: [true, "Release Date is required"],
    },
    description: {
        type: String,
        required: [true, "Add movie synopsis"]
    },
    posterUrl: {
        type: String,
        required: [true, "Add movie poster"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    }
})

const Movies = mongoose.model('Movie', MovieSchema);
module.exports = Movies 