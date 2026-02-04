// src/repositories/category.repo.js
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../services/dynamodb");

const TABLE = process.env.DYNAMODB_TABLE_CATEGORIES;

// Lấy tất cả category
async function getAll() {
  const data = await dynamodb.scan({ TableName: TABLE }).promise();
  return data.Items || [];
}

// Lấy 1 category theo id
async function getById(categoryId) {
  const data = await dynamodb
    .get({ TableName: TABLE, Key: { categoryId } })
    .promise();
  return data.Item;
}

// Tạo category mới
async function createCategory({ name, description }) {
  const item = {
    categoryId: uuidv4(),
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  await dynamodb.put({ TableName: TABLE, Item: item }).promise();
  return item;
}

// Cập nhật category (cách dễ: get rồi put lại)
async function updateCategory(categoryId, { name, description }) {
  const current = await getById(categoryId);
  const newItem = { ...current, name, description };
  await dynamodb.put({ TableName: TABLE, Item: newItem }).promise();
  return newItem;
}

// Xoá category
async function deleteCategory(categoryId) {
  await dynamodb
    .delete({ TableName: TABLE, Key: { categoryId } })
    .promise();
}

module.exports = {
  getAll,
  getById,
  createCategory,
  updateCategory,
  deleteCategory,
};