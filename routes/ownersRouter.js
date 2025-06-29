const express = require("express");
const router = express.Router();
const ownermodel = require("../models/owner-model");
const bcrypt = require("bcrypt");

// router.get("/", (req, res) => {
// res.send("Welcome to the owner route");
// })

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        let owner = await ownermodel.find();
        if(owner.length > 0){
            return res.status(400).json({ message: "Owner already exists" });
        }
        if (!req.body) {
                return res.status(400).json({ message: "Request body missing" });
            }
            let  { fullname, email, password }  = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            let createdOwner = await ownermodel.create({
                fullname,
                email,
                password: hash,
            });
          res.send(createdOwner);
        })
    }
   
router.get("/admin", async (req, res) => {
    let success = req.flash('success')
    res.render("createproducts",{success});
});
module.exports = router;