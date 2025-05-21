const express = require("express");
const router = express.Router();
const {RegisterUser, loginUser } = require("../controllers/authController");
router.get("/", (req, res) => {
 
  console.log("req.body =>", req.body);
});

router.post("/Register", RegisterUser); 

router.post('/login', loginUser)
module.exports = router;