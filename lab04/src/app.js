// src/app.js
const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");

const productRoutes = require("./routes/products.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");

const app = express();

// Middleware chung
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "secret_lab04",  // cho lab, sau này đưa vào .env
    resave: false,
    saveUninitialized: false,
  })
);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoutes);          // /login, /logout
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});