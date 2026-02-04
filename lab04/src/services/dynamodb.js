require("dotenv").config();
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;