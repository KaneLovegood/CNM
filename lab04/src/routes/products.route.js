// src/routes/products.route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const productService = require("../services/product.service");
const categoryService = require("../services/category.service");
const s3 = require("../services/s3");
const { requireLogin } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

// Danh sách + filter + phân trang
router.get("/", requireLogin, async (req, res) => {
  const { categoryId, minPrice, maxPrice, keyword, page = 1 } = req.query;
  const limit = 5;

  const result = await productService.list({
    categoryId,
    minPrice,
    maxPrice,
    keyword,
    page: Number(page),
    limit,
  });

  const categories = await categoryService.getAll();

  res.render("products/list", {
    products: result.items,
    total: result.total,
    page: Number(page),
    limit,
    categories,
    filters: { categoryId, minPrice, maxPrice, keyword },
    user: req.session.user,
  });
});

// Form thêm
router.get("/add", requireLogin, requireAdmin, async (req, res) => {
  const categories = await categoryService.getAll();
  res.render("products/add", { categories });
});

// Xử lý thêm (upload S3 + tạo product + log)
router.post("/add", requireLogin, requireAdmin, upload.single("image"), async (req, res) => {
  const { name, price, quantity, categoryId } = req.body;
  let imageUrl = "";

  if (req.file) {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const result = await s3.upload(uploadParams).promise();
    imageUrl = result.Location;
  }

  await productService.create(
    {
      name,
      price: Number(price),
      quantity: Number(quantity),
      categoryId,
      url_image: imageUrl,
    },
    req.session.user.userId
  );

  res.redirect("/products");
});

// Form edit + xử lý edit, soft delete tương tự

module.exports = router;