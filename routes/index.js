const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/islogedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", {error , loggedin : false });
});

router.get("/shop",isloggedin, async function (req, res) {
  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  let products = await productModel.find(filter)
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("shop", { products, success, error });
});
router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  try {
    console.log('Add to cart request received for product:', req.params.productid);
    console.log('User email:', req.user ? req.user.email : 'No user');
    
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      console.log('User not found in database');
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }
    
    console.log('User found:', user.email, 'Current cart length:', user.cart.length);
    
    // Check if product exists
    let product = await productModel.findById(req.params.productid);
    if (!product) {
      console.log('Product not found:', req.params.productid);
      req.flash("error", "Product not found");
      return res.redirect("/shop");
    }
    
    console.log('Product found:', product.name);
    
    // Initialize cart as array if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }
    
    // Check if product is already in cart
    let existingItemIndex = -1;
    
    for (let i = 0; i < user.cart.length; i++) {
      const item = user.cart[i];
      let itemProductId;
      
      // Handle different cart item formats
      if (item && typeof item === 'object' && item.product) {
        itemProductId = item.product.toString();
      } else if (item) {
        itemProductId = item.toString();
      }
      
      if (itemProductId === req.params.productid) {
        existingItemIndex = i;
        break;
      }
    }
    
    if (existingItemIndex !== -1) {
      // Product exists, update quantity
      const existingItem = user.cart[existingItemIndex];
      if (existingItem.product) {
        // New format - update quantity
        const currentQuantity = existingItem.quantity || 1;
        existingItem.quantity = currentQuantity + 1;
        console.log('Updated existing item quantity to:', existingItem.quantity);
        req.flash("success", "Product quantity updated in cart");
      } else {
        // Old format - convert to new format
        user.cart[existingItemIndex] = {
          product: existingItem,
          quantity: 2
        };
        console.log('Converted old format item to new format');
        req.flash("success", "Product quantity updated in cart");
      }
    } else {
      // New product - add to cart
      user.cart.push({
        product: req.params.productid,
        quantity: 1
      });
      console.log('Added new item to cart');
      req.flash("success", "Product added to cart successfully");
    }
    
    // Mark cart as modified since it's a mixed type
    user.markModified('cart');
    
    await user.save();
    console.log('Cart saved successfully. New cart length:', user.cart.length);
    
    res.redirect("/shop");
  } catch (err) {
    console.error('Add to cart error:', err);
    req.flash("error", "Something went wrong while adding to cart");
    res.redirect("/shop");
  }
});

router.get("/cart", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }

    let cartItems = [];
    let totalMRP = 0;
    let totalDiscount = 0;
    let platformFee = 20;
    let shippingFee = 0; // Free shipping

    // Process cart items safely
    if (user.cart && Array.isArray(user.cart)) {
      for (let cartItem of user.cart) {
        let productId;
        let quantity = 1;
        
        // Determine product ID and quantity
        if (cartItem && typeof cartItem === 'object' && cartItem.product) {
          // New format: {product: ObjectId, quantity: Number}
          productId = cartItem.product;
          quantity = cartItem.quantity || 1;
        } else if (cartItem) {
          // Old format: direct ObjectId reference
          productId = cartItem;
          quantity = 1;
        } else {
          continue; // Skip invalid items
        }
        
        try {
          // Fetch product details
          let product = await productModel.findById(productId);
          
          if (product) {
            // Add quantity property to the product for display
            const productWithQuantity = {
              ...product.toObject(),
              quantity: quantity
            };
            cartItems.push(productWithQuantity);
            
            // Calculate totals
            totalMRP += product.price * quantity;
            // Discount calculation removed as requested
          }
        } catch (err) {
          console.error('Error fetching product:', err);
          // Skip this item and continue
        }
      }
    }

    let finalTotal = totalMRP - totalDiscount + platformFee + shippingFee;

    let success = req.flash("success");
    let error = req.flash("error");

    res.render("cart", { 
      cartItems, 
      totalMRP, 
      totalDiscount, 
      platformFee, 
      shippingFee, 
      finalTotal,
      success, 
      error 
    });
  } catch (err) {
    req.flash("error", "Something went wrong while loading your cart");
    res.redirect("/shop");
  }
});

router.get("/removefromcart/:productid", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/cart");
    }

    console.log('Before removal - Cart length:', user.cart.length);
    console.log('Product ID to remove:', req.params.productid);
    
    // Check if product exists in cart
    const originalCartLength = user.cart.length;
    
    // Remove the product from cart - handle both old and new formats
    const filteredCart = user.cart.filter(item => {
      let itemProductId;
      
      if (item && typeof item === 'object' && item.product) {
        // New format: {product: ObjectId, quantity: Number}
        itemProductId = item.product.toString();
      } else if (item) {
        // Old format: direct ObjectId reference
        itemProductId = item.toString();
      } else {
        return false; // Remove invalid items
      }
      
      const shouldKeep = itemProductId !== req.params.productid;
      console.log(`Item ${itemProductId} should keep: ${shouldKeep}`);
      return shouldKeep;
    });
    
    user.cart = filteredCart;
    
    // Mark cart as modified for mixed arrays
    user.markModified('cart');
    await user.save();
    
    console.log('After removal - Cart length:', user.cart.length);
    
    if (user.cart.length < originalCartLength) {
      req.flash("success", "Item removed from cart successfully");
    } else {
      req.flash("error", "Item not found in cart");
    }
    
    // Clear any existing flash messages first, then redirect
    res.redirect("/cart");
  } catch (err) {
    console.error('Remove from cart error:', err);
    req.flash("error", "Something went wrong while removing item from cart");
    res.redirect("/cart");
  }
});

// Update quantity in cart
router.post("/updatequantity/:productid", isloggedin, async function (req, res) {
  try {
    const { action } = req.body; // 'increase' or 'decrease'
    let user = await userModel.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the cart item
    const cartItem = user.cart.find(item => 
      item.product && item.product.toString() === req.params.productid
    );
    
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    if (action === 'increase') {
      cartItem.quantity += 1;
    } else if (action === 'decrease') {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        // Remove item if quantity becomes 0
        user.cart = user.cart.filter(item => 
          item.product.toString() !== req.params.productid
        );
      }
    }

    await user.save();
    res.json({ success: true, quantity: cartItem.quantity || 0 });
  } catch (err) {
    console.error('Update quantity error:', err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Checkout route
router.get("/checkout", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      req.flash("error", "Your cart is empty. Add some products before checkout.");
      return res.redirect("/shop");
    }

    // Get cart items for checkout summary
    let cartItems = [];
    let totalMRP = 0;
    let totalDiscount = 0;
    let platformFee = 50;
    let shippingFee = 0;

    for (let cartItem of user.cart) {
      let productId, quantity = 1;
      
      if (cartItem && typeof cartItem === 'object' && cartItem.product) {
        productId = cartItem.product;
        quantity = cartItem.quantity || 1;
      } else if (cartItem) {
        productId = cartItem;
        quantity = 1;
      } else {
        continue;
      }
      
      try {
        let product = await productModel.findById(productId);
        if (product) {
          const productWithQuantity = {
            ...product.toObject(),
            quantity: quantity
          };
          cartItems.push(productWithQuantity);
          
          totalMRP += product.price * quantity;
          if (product.discount) {
            let discountAmount = (product.price * parseFloat(product.discount) * quantity) / 100;
            totalDiscount += discountAmount;
          }
        }
      } catch (err) {
        console.error('Error fetching product for checkout:', err);
      }
    }

    let finalTotal = totalMRP - totalDiscount + platformFee + shippingFee;

    let success = req.flash("success");
    let error = req.flash("error");

    res.render("checkout", { 
      cartItems, 
      totalMRP, 
      totalDiscount, 
      platformFee, 
      shippingFee, 
      finalTotal,
      user,
      success, 
      error 
    });
  } catch (err) {
    console.error('Checkout error:', err);
    req.flash("error", "Something went wrong while loading checkout");
    res.redirect("/cart");
  }
});

// Process checkout (place order)
router.post("/placeorder", isloggedin, async function (req, res) {
  try {
    const { address, phone } = req.body;
    
    if (!address || !phone) {
      req.flash("error", "Please provide shipping address and phone number");
      return res.redirect("/checkout");
    }

    let user = await userModel.findOne({ email: req.user.email });
    if (!user || !user.cart || user.cart.length === 0) {
      req.flash("error", "Cart is empty or user not found");
      return res.redirect("/shop");
    }

    // Calculate order total
    let orderTotal = 0;
    let orderItems = [];

    for (let cartItem of user.cart) {
      let productId, quantity = 1;
      
      if (cartItem && typeof cartItem === 'object' && cartItem.product) {
        productId = cartItem.product;
        quantity = cartItem.quantity || 1;
      } else if (cartItem) {
        productId = cartItem;
        quantity = 1;
      } else {
        continue;
      }
      
      let product = await productModel.findById(productId);
      if (product) {
        let itemTotal = product.price * quantity;
        if (product.discount) {
          itemTotal -= (itemTotal * parseFloat(product.discount)) / 100;
        }
        orderTotal += itemTotal;
        
        orderItems.push({
          product: productId,
          name: product.name,
          price: product.price,
          quantity: quantity,
          discount: product.discount || 0
        });
      }
    }

    // Add platform fee
    orderTotal += 50;

    // Create order object
    const order = {
      items: orderItems,
      total: orderTotal,
      address: address,
      phone: phone,
      status: "pending",
      orderDate: new Date()
    };

    // Add order to user's orders
    user.orders.push(order);
    
    // Clear cart
    user.cart = [];
    
    await user.save();

    req.flash("success", "Order placed successfully! Your order is being processed.");
    res.redirect("/orders");
  } catch (err) {
    console.error('Place order error:', err);
    req.flash("error", "Something went wrong while placing order");
    res.redirect("/checkout");
  }
});

// View orders
router.get("/orders", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }

    let success = req.flash("success");
    let error = req.flash("error");

    res.render("orders", { 
      orders: user.orders || [], 
      success, 
      error 
    });
  } catch (err) {
    console.error('Orders error:', err);
    req.flash("error", "Something went wrong while loading orders");
    res.redirect("/shop");
  }
});

// Account page
router.get("/account", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }

    let success = req.flash("success");
    let error = req.flash("error");

    res.render("account", { 
      user, 
      success, 
      error 
    });
  } catch (err) {
    console.error('Account error:', err);
    req.flash("error", "Something went wrong while loading account");
    res.redirect("/shop");
  }
});

// Change Password
router.post("/changepassword", isloggedin, async function (req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      req.flash("error", "All fields are required and new password must be at least 6 characters.");
      return res.redirect("/account");
    }
    if (newPassword !== confirmPassword) {
      req.flash("error", "New passwords do not match.");
      return res.redirect("/account");
    }
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/account");
    }
    // Check current password
    const bcrypt = require("bcrypt");
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      req.flash("error", "Current password is incorrect.");
      return res.redirect("/account");
    }
    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    req.flash("success", "Password changed successfully.");
    res.redirect("/account");
  } catch (err) {
    console.error('Change password error:', err);
    req.flash("error", "Something went wrong while changing password");
    res.redirect("/account");
  }
});

// Update profile
router.post("/updateprofile", isloggedin, async function (req, res) {
  try {
    const { fullname, contact } = req.body;
    
    // Validate input
    if (!fullname || fullname.trim().length < 3) {
      req.flash("error", "Full name must be at least 3 characters long");
      return res.redirect("/account");
    }

    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/account");
    }

    // Update user profile
    user.fullname = fullname.trim();
    if (contact && contact.trim()) {
      user.contact = contact.trim();
    }

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/account");
  } catch (err) {
    console.error('Update profile error:', err);
    req.flash("error", "Something went wrong while updating profile");
    res.redirect("/account");
  }
});

router.get("/logout", isloggedin, function (req, res) {
  res.cookie("token", "");
  req.flash("success", "You have been logged out successfully!");
  res.redirect("/");
});

// Clear flash messages endpoint
router.post("/clearflash", function (req, res) {
  // Clear any remaining flash messages
  req.flash('success');
  req.flash('error');
  res.json({ success: true });
});

// Cancel/Delete order (removes the order entirely)
router.post("/cancelorder/:orderindex", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orderIndex = parseInt(req.params.orderindex);
    if (orderIndex < 0 || orderIndex >= user.orders.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    user.orders.splice(orderIndex, 1);
    await user.save();

    req.flash('success', 'Order deleted successfully!');
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      res.json({ success: true, message: "Order deleted successfully" });
    } else {
      res.redirect('/orders');
    }
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: "Something went wrong while deleting order" });
  }
});

module.exports = router;
