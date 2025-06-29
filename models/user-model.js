const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/FinalProject");

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
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  }],
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



// const mongoose = require('mongoose');

// mongoose.connect("mongodb://127.0.0.1:27017/FinalProject");

// const userSchema = mongoose.Schema({
//   fullname: {
//     type: String,
//     minLength: 3,
//     trim: true,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   cart:[{
//     Type: mongoose.Schema.Types.ObjectId,
//     ref: "products",
// }],
//     orders:{
//         type: Array,
//         default:[]
//     },
//   contact: {
//     type: Number,
//   },
//   picture: { String ,
//   },
// }); 

// module.exports = mongoose.model("User", userSchema);