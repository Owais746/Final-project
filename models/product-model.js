const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image:{
      image:Buffer,     
    },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  bgcolor: {
    type: String,
    default: 'gray-200'
  },
  panelcolor: {
    type: String,
    default: 'white'
  },
  textcolor: {
    type: String,
    default: 'black'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("product", productSchema);
