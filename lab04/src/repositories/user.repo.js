// src/repositories/user.repo.js
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../services/dynamodb");

const TABLE = process.env.DYNAMODB_TABLE_USERS;

async function findByUsername(username) {
  const params = {
    TableName: TABLE,
    IndexName: "username-index", // nếu bạn tạo GSI cho username, nếu chưa có tạm dùng scan
    KeyConditionExpression: "username = :u",
    ExpressionAttributeValues: {
      ":u": username,
    },
  };
  const data = await dynamodb.query(params).promise();
  return data.Items[0];
}

async function createUser({ username, password, role }) {
  const user = {
    userId: uuidv4(),
    username,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  await dynamodb
    .put({ TableName: TABLE, Item: user })
    .promise();
  return user;
}

module.exports = {
  findByUsername,
  createUser,
};