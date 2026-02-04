// src/services/product.service.js
const productRepo = require("../repositories/product.repo");

function buildStatus(quantity) {
  if (quantity === 0) return { text: "Hết hàng", color: "red" };
  if (quantity < 5) return { text: "Sắp hết", color: "orange" };
  return { text: "Còn hàng", color: "green" };
}

async function list({ categoryId, minPrice, maxPrice, keyword, page = 1, limit = 10 }) {
  let items = await productRepo.scanAll();
  // Ẩn sản phẩm đã xóa mềm
  items = items.filter(p => !p.isDeleted);

  if (categoryId) {
    items = items.filter(p => p.categoryId === categoryId);
  }

  if (minPrice) {
    items = items.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    items = items.filter(p => p.price <= Number(maxPrice));
  }

  if (keyword) {
    const kw = keyword.toLowerCase();
    items = items.filter(p => (p.name || "").toLowerCase().includes(kw));
  }

  // phân trang đơn giản
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  // thêm status tồn kho
  for (const p of paged) {
    p.inventoryStatus = buildStatus(p.quantity);
  }

  return { items: paged, total };
}

async function create(data, userId) {
  const product = await productRepo.createProduct(data);
  return product;
}

async function update(id, data, userId) {
  const product = await productRepo.updateProduct(id, data);
  return product;
}

async function softDelete(id, userId) {
  await productRepo.softDeleteProduct(id);
}

async function getById(id) {
  return await productRepo.getById(id);
}

module.exports = {
  list,
  create,
  update,
  softDelete,
  getById,
};