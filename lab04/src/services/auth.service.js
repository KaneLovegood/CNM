// src/services/auth.service.js
const bcrypt = require("bcryptjs");
const userRepo = require("../repositories/user.repo");

async function login(username, password) {
  const user = await userRepo.findByUsername(username);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return {
    userId: user.userId,
    username: user.username,
    role: user.role,
  };
}

module.exports = { login };