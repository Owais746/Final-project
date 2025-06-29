const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/islogedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", {error , loggedin : false });
});

router.get("/shop",isloggedin, function (req, res) {
  let products = productModel.find()
  let success = req.flash("success");
  res.render("shop", { products, success, loggedin: true });
});
// router.get("/addtocart/:id",isloggedin, async function (req, res) {
//   let user = await userModel.findOne({ _id: req.user.email });
//   user.cart.push(req.params.productid);
//   await user.save();
//   req.flash("success", "Product added to cart successfully");
//   res.redirect("/shop");
// });
router.get("/addtocart/:id", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email }); 
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Product added to cart successfully");
    res.redirect("/shop");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/shop");
  }
});


router.get("/logout",isloggedin, function (req, res) {
  

});

module.exports = router;