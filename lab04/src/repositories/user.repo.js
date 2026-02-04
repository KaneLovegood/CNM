// src/repositories/user.repo.js
const { v4: uuidv4 } = require("uuid");
const dynamodb = require("../services/dynamodb");

const TABLE = process.env.DYNAMODB_TABLE_USERS;

async function findByUsername(username) {
  // Dùng scan tạm thời (nếu chưa có GSI username-index)
  const params = {
    TableName: TABLE,
    FilterExpression: "username = :u",
    ExpressionAttributeValues: {
      ":u": username,
    },
  };
  const data = await dynamodb.scan(params).promise();
  return data.Items[0];
}

async function createUser({ username, password, role }) {
  const user = {
    id: uuidv4(),  // Table Users có thể dùng 'id' làm primary key (kiểm tra lại trong DynamoDB)
    username,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  
  // Debug: log item trước khi put
  console.log("Creating user with item:", JSON.stringify({ ...user, password: "***" }, null, 2));
  console.log("Table name:", TABLE);
  
  await dynamodb
    .put({ TableName: TABLE, Item: user })
    .promise();
  return user;
}

module.exports = {
  findByUsername,
  createUser,
};