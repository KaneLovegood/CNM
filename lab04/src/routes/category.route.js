// src/routes/category.route.js
const express = require("express");
const router = express.Router();
const categoryService = require("../services/category.service");
const { requireLogin } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

// trong category.route.js, chỉ dùng để seed, xong xoá đi
const categoryRepo = require("../repositories/category.repo");

router.get("/seed", async (req, res) => {
  await categoryRepo.createCategory({ name: "Điện thoại", description: "Các loại điện thoại" });
  await categoryRepo.createCategory({ name: "Laptop", description: "Máy tính xách tay" });
  await categoryRepo.createCategory({ name: "Phụ kiện", description: "Phụ kiện công nghệ" });

  res.send("Đã tạo dữ liệu mẫu category");
});

router.get("/", requireLogin, async (req, res) => {
  const categories = await categoryService.getAll();
  res.render("categories/list", { categories, user: req.session.user });
});

router.get("/add", requireLogin, requireAdmin, (req, res) => {
  res.render("categories/add");
});

router.post("/add", requireLogin, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  await categoryService.create({ name, description });
  res.redirect("/categories");
});

router.get("/edit/:id", requireLogin, requireAdmin, async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  res.render("categories/edit", { category });
});

router.post("/edit/:id", requireLogin, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  await categoryService.update(req.params.id, { name, description });
  res.redirect("/categories");
});

router.post("/delete/:id", requireLogin, requireAdmin, async (req, res) => {
  await categoryService.remove(req.params.id);
  res.redirect("/categories");
});



module.exports = router;