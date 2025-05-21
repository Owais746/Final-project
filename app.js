const express = require("express");
const app = express();
app.use(express.json());

const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");
const cookieParser = require("cookie-parser");
const path = require("path");
// const db = require("./config/mongoose-connection");
const session = require("express-session");
const flash = require("connect-flash");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_KEY,
    })
)
app.use(flash());
require("dotenv").config();

app.use("/owners", ownersRouter );
app.use("/users", usersRouter );
app.use("/products", productsRouter );
app.use("/", indexRouter );

app.listen(3000);
