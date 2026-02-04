// src/repositories/log.repo.js
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../services/dynamodb");

const TABLE = process.env.DYNAMODB_TABLE_LOGS || "ProductLogs";

async function createLog({ productId, action, userId, time }) {
  const item = {
    logId: uuidv4(),  // Kiểm tra xem table dùng 'id' hay 'logId' làm primary key
    productId,
    action,  // CREATE, UPDATE, DELETE
    userId,
    time: time || new Date().toISOString(),
  };
  
  await dynamodb.put({ TableName: TABLE, Item: item }).promise();
  return item;
}

module.exports = {
  createLog,
};
