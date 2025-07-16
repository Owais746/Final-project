// const mongoose = require('mongoose');
// const dbgr = require('debug')('development:mongoose');
// const config = require('config');
// // Connect to MongoDB
// mongoose.connect(`${config.get("MONGODB_URI")}/FinalProject`)
// .then(() => {
//      console.log("MongoDB connected successfully");
//      dbgr("MongoDB connected successfully");
// }).catch((err) => {
//     console.error("MongoDB connection error:", err);
//     dbgr("MongoDB connection error:", err);
// });
// module.exports = mongoose.connection;
// config/mongoose-connection.js
const mongoose = require('mongoose');

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI; // ensure this is set
    if (!uri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    }).then(m => {
      console.log('✅ MongoDB connected successfully');
      return m;
    }).catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.log('🔄 Running in offline mode - some features may not work');
      // Don't throw error to allow app to continue running
      return null;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return null;
  }
}

module.exports = dbConnect;
