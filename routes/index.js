const express = require("express");
const router = express.Router();
const islogedin = require("../middleware/islogedin");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", {error });
});

router.get("/shop",islogedin, function (req, res) {
  res.render("shop");
});
module.exports = router;