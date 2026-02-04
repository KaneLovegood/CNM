// src/routes/auth.route.js
const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.login(username, password);
  if (!user) {
    return res.render("login", { error: "Sai tài khoản hoặc mật khẩu" });
  }
  req.session.user = user;
  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;