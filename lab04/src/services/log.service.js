// src/services/log.service.js
const logRepo = require("../repositories/log.repo");

async function logProduct(productId, action, userId) {
  // Ghi log khi thao tác với sản phẩm
  await logRepo.createLog({
    productId,
    action,  // CREATE, UPDATE, DELETE
    userId,
    time: new Date().toISOString(),
  });
}

module.exports = {
  logProduct,
};
