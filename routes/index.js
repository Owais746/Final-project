const express = require("express");
const router = express.Router();
const usermodel = require("../models/user-model");


router.get("/", function (req, res) {
  let error = req.flash("error");
});


router.post("/register", async function (req, res) {
try{
    let { fullname, email, password } = req.body;

    let user = await usermodel.create({
        fullname,
        email,
        password
    });

}catch(err){console.log(err.message)}
    res.render("index"); 
});


module.exports = router;