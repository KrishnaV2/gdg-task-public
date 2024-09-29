const express = require("express")
const router = express.Router()

router.use('/movie', require("./movieRouter.js"))
router.use('/user', require("./userRouter.js"))

module.exports = router;