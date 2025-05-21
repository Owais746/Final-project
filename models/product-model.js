const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/FinalProject");

const productSchema = mongoose.Schema({
    image: {
      type: String,
      required: true,
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
  paneelcolor:String,
  textcolor:String,
});

module.exports = mongoose.model("product", productSchema);







//   category: {
//     type: String,
//     required: true,
//   },