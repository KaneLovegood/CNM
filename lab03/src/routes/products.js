const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const dynamodb = require("../services/dynamodb");
const s3 = require("../services/s3");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
require("dotenv").config();
router.get("/", async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  const data = await dynamodb.scan(params).promise();
  res.render("list", { products: data.Items });

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", upload.single("image"), async (req, res) => {
  const { name, price, quantity } = req.body;
  const id = uuidv4();

  let imageUrl = "";

  // Upload ảnh lên S3
  if (req.file) {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${id}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(uploadParams).promise();
    imageUrl = result.Location;
  }

  // Lưu DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id,
      name,
      price: Number(price),
      quantity: Number(quantity),
      url_image: imageUrl,
    },
  };

  await dynamodb.put(params).promise();
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: req.params.id },
  };

  const data = await dynamodb.get(params).promise();
  res.render("edit", { product: data.Item });
});
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const { name, price, quantity } = req.body;
  let imageUrl = req.body.oldImage;

  if (req.file) {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${req.params.id}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(uploadParams).promise();
    imageUrl = result.Location;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: req.params.id },
    UpdateExpression:
      "set #n=:n, price=:p, quantity=:q, url_image=:i",
    ExpressionAttributeNames: {
      "#n": "name",
    },
    ExpressionAttributeValues: {
      ":n": name,
      ":p": Number(price),
      ":q": Number(quantity),
      ":i": imageUrl,
    },
  };

  await dynamodb.update(params).promise();
  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: req.params.id },
  };

  await dynamodb.delete(params).promise();
  res.redirect("/");
});
});

module.exports = router;