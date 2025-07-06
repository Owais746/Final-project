const usermodel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const { generatetoken } = require("../utils/generatetoken");
const productModel = require("../models/product-model");

module.exports.RegisterUser = async function (req, res) {
        try  {
          const  { email, password, fullname, }= req.body;
        let existingUser = await usermodel.findOne({ email: email});
    if (existingUser) {
      return res.status(400).send("User already exists, please try login");
    }
        const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
      
      const user = await usermodel.create({
            email,
            password: hash,
            fullname,
          });
          let token = generatetoken(user);
          res.cookie('token', token)
          const products = await productModel.find();
          res.render("shop", { products, success: [], error: [] });
        } catch (err) {
          res.status(500).json({ message: "Registration failed. Please try again." });
        }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    
    if (!user) {
      req.flash("error", "Invalid Email or Password");
      return res.redirect("/");
    }
    
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err) {
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/");
      }
      
      if (result) {
        const products = await productModel.find(); 
        let token = generatetoken(user);
        res.cookie("token", token);
        req.flash("success", "Welcome back!");
        res.render("shop", { products, success: req.flash("success"), error: [] });
      } else {
        req.flash("error", "Invalid Email or Password");
        res.redirect("/");
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/");
  }
};
module.exports.logoutUser = function (req, res) {
  res.cookie("token" ,"");
  res.redirect("/");
}