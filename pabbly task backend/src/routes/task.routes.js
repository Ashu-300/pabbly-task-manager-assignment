const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  moveTaskPriority,
  getMyTasks,
  assignTaskToUser
} = require("../controller/task.controller");

const { protect , authorize } = require("../middleware/auth.middleware");

const taskRouter = express.Router();


taskRouter.use(protect);

taskRouter.post("/", createTask);
taskRouter.get("/", getAllTasks);
taskRouter.get("/my-tasks", getMyTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.patch("/:id/status", updateTaskStatus);
taskRouter.patch("/:id/priority", moveTaskPriority);
taskRouter.delete("/:id", authorize("admin"), deleteTask);
taskRouter.patch("/:id/assign", authorize("admin"), assignTaskToUser);

module.exports = {taskRouter};