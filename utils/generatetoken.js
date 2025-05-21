const jwt = require("jsonwebtoken");

const generatetoken = (user)=> {
 return  jwt.sign({email: user.email, id:user._id}, process.env.JWT_KEY, {
    expiresIn: "15d",
  });
}


module.exports.generatetoken = generatetoken;