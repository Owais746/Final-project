const express = require("express");
require("dotenv").config(); // Load environment variables first
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
const session = require("express-session");
const flash = require("connect-flash");
const { generalLimiter } = require("./middleware/rateLimiter");
const { sanitizeInput } = require("./middleware/validation");

// Connect to MongoDB
db();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Apply general rate limiting to all routes      
app.use(generalLimiter);

// Apply input sanitization to all routes
app.use(sanitizeInput);

// Session configuration
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_KEY,
    })
);
app.use(flash());

// Import routers
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/indexRouter");

// Use routers
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    // Log to console in development, use proper logging in production
    if (process.env.NODE_ENV === 'development') {
        console.error('Application error:', err);
    }
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Visit: http://localhost:' + PORT);
});
