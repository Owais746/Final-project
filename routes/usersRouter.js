const express = require("express");
const router = express.Router();
const {RegisterUser, loginUser, logoutUser } = require("../controllers/authController");

router.post("/Register", RegisterUser); 

router.post('/login', loginUser)

router.get("/logout", logoutUser)

module.exports = router;