const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
const config = require('config');

// Connect to MongoDB
mongoose.connect(`${config.get("MONGODB_URI")}/FinalProject`)
.then(() => {
     console.log("MongoDB connected successfully");
     dbgr("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    dbgr("MongoDB connection error:", err);
});

module.exports = mongoose.connection;

