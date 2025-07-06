const express = require("express");
const router = express.Router();
const ownermodel = require("../models/owner-model");
const bcrypt = require("bcrypt");


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
    try {
        const productModel = require("../models/product-model");
        const products = await productModel.find().sort({ createdAt: -1 });
        res.render("admin", { products, orders: [], totalOrders: 0 });
    } catch (err) {
        console.error('Admin panel error:', err);
        res.render("admin", { products: [], orders: [], totalOrders: 0 });
    }
});

router.get("/create", (req, res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    res.render("createproducts", { success, error });
});
module.exports = router;