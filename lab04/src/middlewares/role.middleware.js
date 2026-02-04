// src/middlewares/role.middleware.js
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).send("Bạn không có quyền truy cập");
    }
    next();
  }
  
  module.exports = { requireAdmin };