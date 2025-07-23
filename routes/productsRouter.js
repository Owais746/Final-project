const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config")
const productModel = require("../models/product-model")

// Create product
router.post("/create", upload.single("image"), async (req, res) => {
  try{
    let {name, price, discount, category,} = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      req.flash('error', 'Product name must be at least 2 characters long');
      return res.redirect("/owners/admin");
    }
    
    if (!price || price <= 0) {
      req.flash('error', 'Please provide a valid price');
      return res.redirect("/owners/admin");
    }

    if (!category || category.trim().length < 1) {
      req.flash('error', 'Please provide a category');
      return res.redirect("/owners/admin");
    }

    if (!req.file) {
      req.flash('error', 'Please upload a product image');
      return res.redirect("/owners/admin");
    }

    let productData = {
        image: {
            image: req.file.buffer
        },
        name: name.trim(),
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        category: category.trim(),
        bgcolor: bgcolor || 'gray-200',
        panelcolor: panelcolor || 'white',
        textcolor: textcolor || 'black'
    };

    let product = await productModel.create(productData);
    req.flash('success', 'Product created successfully');
    res.redirect("/owners/admin");
    
  } catch(err) {
    console.error('Create product error:', err);
    req.flash('error', 'Error creating product: ' + err.message);
    res.redirect("/owners/admin");
  }
});

// Get product for editing
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect("/owners/admin");
    }
    
    let success = req.flash('success');
    let error = req.flash('error');
    res.render("editproduct", { product, success, error });
  } catch (err) {
    console.error('Get product error:', err);
    req.flash('error', 'Error loading product');
    res.redirect("/owners/admin");
  }
});

// Update product
router.post("/update/:id", upload.single("image"), async (req, res) => {
  try {
    let {name, price, discount, category, bgcolor, panelcolor, textcolor} = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      req.flash('error', 'Product name must be at least 2 characters long');
      return res.redirect(`/products/edit/${req.params.id}`);
    }
    
    if (!price || price <= 0) {
      req.flash('error', 'Please provide a valid price');
      return res.redirect(`/products/edit/${req.params.id}`);
    }

    if (!category || category.trim().length < 1) {
      req.flash('error', 'Please provide a category');
      return res.redirect(`/products/edit/${req.params.id}`);
    }

    let updateData = {
      name: name.trim(),
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      category: category.trim(),
      bgcolor: bgcolor || 'gray-200',
      panelcolor: panelcolor || 'white',
      textcolor: textcolor || 'black'
    };

    // Update image if new one is uploaded
    if (req.file) {
      updateData.image = {
        image: req.file.buffer
      };
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect("/owners/admin");
    }

    req.flash('success', 'Product updated successfully');
    res.redirect("/owners/admin");
  } catch (err) {
    console.error('Update product error:', err);
    req.flash('error', 'Error updating product: ' + err.message);
    res.redirect(`/products/edit/${req.params.id}`);
  }
});

// Delete product
router.post("/delete/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect("/owners/admin");
    }

    req.flash('success', 'Product deleted successfully');
    res.redirect("/owners/admin");
  } catch (err) {
    console.error('Delete product error:', err);
    req.flash('error', 'Error deleting product');
    res.redirect("/owners/admin");
  }
});

// Get all products (API endpoint)
router.get("/api/all", async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ success: false, error: 'Error fetching products' });
  }
});

module.exports = router;
