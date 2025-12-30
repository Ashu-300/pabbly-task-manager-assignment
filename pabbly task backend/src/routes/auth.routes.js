const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile
} = require("../controller/auth.controller");

const { protect } = require("../middleware/auth.middleware");

const authRouter = express.Router();

// Public routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Protected route
authRouter.get("/me", protect, getProfile);

module.exports = {authRouter};