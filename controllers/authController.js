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
          res.render("shop");
        } catch (err) {
          console.error("Error during registration:", err.message);
          res.status(500).json({ message: "Internal Server Error" });
        }
};

module.exports.loginUser = async function (req, res) {
  
  const { email, password } = req.body;
  const user = await usermodel.findOne({ email});
  if(!user) res.send("Invalid Email or Password");
  
  bcrypt.compare(password, user.password, async function (err, result) {
    if(result){
      const products = await productModel.find(); 
      let token = generatetoken;
      res.cookie("token",token)
      res.render("shop", { products });
      
    }
   })

};
module.exports.logoutUser = function (req, res) {
  res.cookie("token" ,"");
  res.redirect("/");
}