// src/routes/auth.route.js
const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");
const userRepo = require("../repositories/user.repo");
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});
// Route seed để tạo user admin đầu tiên (chỉ dùng 1 lần, sau đó xoá route này)
router.get("/login/seed", async (req, res) => {
  const bcrypt = require("bcryptjs");
  
  try {
    // Kiểm tra xem đã có user admin chưa
    const existingAdmin = await userRepo.findByUsername("admin");
    if (existingAdmin) {
      return res.send("User admin đã tồn tại!");
    }

    // Tạo user admin
    const hashedPassword = await bcrypt.hash("admin123", 10); // Mật khẩu mặc định: admin123
    await userRepo.createUser({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    // Tạo user staff mẫu
    const hashedPasswordStaff = await bcrypt.hash("staff123", 10);
    await userRepo.createUser({
      username: "staff",
      password: hashedPasswordStaff,
      role: "staff",
    });

    res.send(`
      <h2>Đã tạo user mẫu thành công!</h2>
      <p><strong>Admin:</strong> username: admin, password: admin123</p>
      <p><strong>Staff:</strong> username: staff, password: staff123</p>
      <p><a href="/login">Đăng nhập ngay</a></p>
      <p style="color: red;"><strong>Lưu ý:</strong> Xoá route /login/seed sau khi đã tạo xong!</p>
    `);
  } catch (error) {
    res.status(500).send(`Lỗi: ${error.message}`);
  }
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