const validator = require('validator');

// Validate email
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email || !validator.isEmail(email)) {
    req.flash("error", "Please provide a valid email address");
    return res.redirect(req.get('referer') || '/');
  }
  
  next();
};

// Validate password
const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password || password.length < 6) {
    req.flash("error", "Password must be at least 6 characters long");
    return res.redirect(req.get('referer') || '/');
  }
  
  next();
};

// Validate product data
const validateProduct = (req, res, next) => {
  const { name, price, category, discount } = req.body;
  
  if (!name || name.trim().length < 2) {
    req.flash("error", "Product name must be at least 2 characters long");
    return res.redirect(req.get('referer') || '/');
  }
  
  if (!price || isNaN(price) || price <= 0) {
    req.flash("error", "Please provide a valid price");
    return res.redirect(req.get('referer') || '/');
  }

  if (!category || category.trim().length < 1) {
    req.flash("error", "Please select a category");
    return res.redirect(req.get('referer') || '/');
  }

  if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
    req.flash("error", "Discount must be between 0 and 100");
    return res.redirect(req.get('referer') || '/');
  }
  
  next();
};

// Sanitize input
const sanitizeInput = (req, res, next) => {
  // Trim whitespace from all string inputs
  for (let key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProduct,
  sanitizeInput
};
