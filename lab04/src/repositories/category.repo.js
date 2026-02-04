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
    .get({ TableName: TABLE, Key: { id: categoryId } })
    .promise();
  return data.Item;
}

// Tạo category mới
async function createCategory({ name, description }) {
  const item = {
    id: uuidv4(),  // Table Categories dùng 'id' làm primary key
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  
  // Debug: log item trước khi put
  console.log("Creating category with item:", JSON.stringify(item, null, 2));
  console.log("Table name:", TABLE);
  
  await dynamodb.put({ TableName: TABLE, Item: item }).promise();
  return item;
}

// Cập nhật category (cách dễ: get rồi put lại)
async function updateCategory(categoryId, { name, description }) {
  const current = await getById(categoryId);
  if (!current) {
    throw new Error(`Category with id ${categoryId} not found`);
  }
  const newItem = { ...current, name, description };
  await dynamodb.put({ TableName: TABLE, Item: newItem }).promise();
  return newItem;
}

// Xoá category
async function deleteCategory(categoryId) {
  await dynamodb
    .delete({ TableName: TABLE, Key: { id: categoryId } })
    .promise();
}

module.exports = {
  getAll,
  getById,
  createCategory,
  updateCategory,
  deleteCategory,
};