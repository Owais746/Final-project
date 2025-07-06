const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
  fullname: {
    type: String,
    minLength: 3,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
    product:{
        type: Array,
        default:[]
    },
  picture:  String , 
  gstin:String,

}); 

module.exports = mongoose.model("owner", ownerSchema);