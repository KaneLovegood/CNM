// src/repositories/product.repo.js
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../services/dynamodb");
const TABLE = process.env.DYNAMODB_TABLE_PRODUCTS;

async function createProduct(data) {
  const item = {
    id: uuidv4(),
    ...data,
    isDeleted: false,
    createdAt: new Date().toISOString(),
  };
  
  // Đảm bảo id không bị override bởi data
  if (!item.id) {
    item.id = uuidv4();
  }
  
  // Debug: log item trước khi put
  console.log("Creating product with item:", JSON.stringify(item, null, 2));
  console.log("Table name:", TABLE);
  
  await dynamodb.put({ TableName: TABLE, Item: item }).promise();
  return item;
}

async function updateProduct(id, updates) {
  // để code đơn giản, bạn có thể get trước -> merge -> put lại
  const current = await getById(id);
  if (!current) {
    throw new Error(`Product with id ${id} not found`);
  }
  const newItem = { ...current, ...updates };
  await dynamodb.put({ TableName: TABLE, Item: newItem }).promise();
  return newItem;
}

async function softDeleteProduct(id) {
  const product = await getById(id);
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  product.isDeleted = true;
  await dynamodb.put({ TableName: TABLE, Item: product }).promise();
}

async function getById(id) {
  const data = await dynamodb
    .get({ TableName: TABLE, Key: { id } })
    .promise();
  return data.Item;
}

async function scanAll() {
  const data = await dynamodb
    .scan({ TableName: TABLE })
    .promise();
  return data.Items || [];
}

module.exports = {
  createProduct,
  updateProduct,
  softDeleteProduct,
  getById,
  scanAll,
};