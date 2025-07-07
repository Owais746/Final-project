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
        const userModel = require("../models/user-model");
        const products = await productModel.find().sort({ createdAt: -1 });
        const users = await userModel.find({}, { orders: 1, fullname: 1, email: 1 });

        // Flatten all orders from all users, annotate with user details
        let orders = [];
        users.forEach(user => {
(user.orders || []).forEach(order => {
                orders.push({
                    ...(order && order._doc ? order._doc : order),
                    customerName: user.fullname || user.email || 'N/A',
                    customerEmail: user.email || 'N/A',
                });
            });
        });

        // Sort by date, newest first
        orders.sort((a,b) => (new Date(b.orderDate || b.createdAt || 0)) - (new Date(a.orderDate || a.createdAt || 0)));

        res.render("admin", { products, orders, totalOrders: orders.length });
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