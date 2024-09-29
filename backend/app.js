const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const rateLimit = require('express-rate-limit')
const path = require("path")

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: "Too many requests, try again after 15 mins",
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

app.use(express.json());
app.use(cors({
    origin: 'https://gdg-task-public-51r9.vercel.app/', // Change this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(cookieParser());
app.use('/api', limiter)
// rate limiting here

dotenv.config({ path: "./.env.local" })
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to DB"))

app.use('/api/v1/', require("./routes/v1/mainRouter.js"));

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(`${__dirname}`, "/frontend/dist")))

//     app.get("*", function (req, res) {
//         res.sendFile(path.resolve(`${__dirname}`, "frontend", "dist", "index.html"))
//     })
// }

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server Started at " + PORT))