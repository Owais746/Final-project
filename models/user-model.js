const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    minLength: 3,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: Array,
    default: []
  },
  orders: {
    type: Array,
    default: []
  },
  contact: {
    type: Number,
  },
  picture: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
