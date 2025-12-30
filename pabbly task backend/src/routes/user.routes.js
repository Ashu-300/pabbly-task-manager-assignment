const express = require("express");
const { getAllUsers } = require("../controller/user.controller");
const { protect } = require("../middleware/auth.middleware");

const userRouter = express.Router();

userRouter.use(protect);
// Allow any authenticated user to list users (used for assign dropdown in frontend)
userRouter.get("/", getAllUsers);

module.exports = { userRouter };
