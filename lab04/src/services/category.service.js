// src/services/category.service.js
const categoryRepo = require("../repositories/category.repo");

async function getAll() {
  return categoryRepo.getAll();
}

async function create(data) {
  return categoryRepo.createCategory(data);
}

async function update(id, data) {
  return categoryRepo.updateCategory(id, data);
}

async function remove(id) {
  // có thể kiểm tra còn sản phẩm dùng category này hay không
  return categoryRepo.deleteCategory(id);
}

module.exports = { getAll, create, update, remove };