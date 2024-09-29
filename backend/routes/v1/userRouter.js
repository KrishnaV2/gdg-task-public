const express = require("express");
const { signin, signup, logout, checkValid } = require("../../controllers/authController");
const router = express.Router();

router.get('/me', checkValid)
router.post('/signin', signin)
router.post('/signup', signup)
router.post('/logout', logout)

module.exports = router;