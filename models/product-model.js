const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/FinalProject");

const productSchema = mongoose.Schema({
    image:{
      image:Buffer,     
    },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: String,
  },
  bgcolor:String,
  panelcolor:String,
  textcolor:String,
});

module.exports = mongoose.model("product", productSchema);
