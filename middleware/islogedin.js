const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You need to login first to access this page");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    
    if (!user) {
      req.flash("error", "User not found. Please login again");
      res.cookie("token", ""); // Clear invalid token
      return res.redirect("/");
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      req.flash("error", "Your session has expired. Please login again");
    } else if (err.name === 'JsonWebTokenError') {
      req.flash("error", "Invalid token. Please login again");
    } else {
      req.flash("error", "Authentication failed. Please login again");
    }
    res.cookie("token", ""); // Clear invalid token
    res.redirect("/");
  }
};
