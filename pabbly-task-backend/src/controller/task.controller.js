const Task = require("../model/task.model");

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message
    });
  }
};

/**
 * @desc    Get all tasks (pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
const getAllTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Admin sees all tasks, user sees assigned tasks
    // But allow explicit request with ?all=true to view all tasks (used by Dashboard overview)
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : (req.user.role === "admin" ? {} : { assignedTo: req.user._id });

    // Use aggregation to enforce priority ordering: high (1), medium (2), low (3)
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 1 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 }
              ],
              default: 3
            }
          }
        }
      },
      { $sort: { priorityOrder: 1, dueDate: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo"
        }
      },
      { $unwind: { path: "$assignedTo", preserveNullAndEmptyArrays: true } },
      { $project: { priorityOrder: 0 } }
    ];

    const tasks = await Task.aggregate(pipeline);

    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};

/**
 * @desc    Get logged-in user's tasks
 * @route   GET /api/tasks/my-tasks
 * @access  Private
 */
const getMyTasks = async (req, res) => {
  try {
    const pipeline = [
      { $match: { assignedTo: req.user._id } },
      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 1 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 }
              ],
              default: 3
            }
          }
        }
      },
      { $sort: { priorityOrder: 1, dueDate: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo"
        }
      },
      { $unwind: { path: "$assignedTo", preserveNullAndEmptyArrays: true } },
      { $project: { priorityOrder: 0 } }
    ];

    const tasks = await Task.aggregate(pipeline);

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user tasks",
      error: error.message
    });
  }
};

/**
 * @desc    Get single task details
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message
    });
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message
    });
  }
};

/**
 * @desc    Update task status
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message
    });
  }
};

/**
 * @desc    Move task between priority lists
 * @route   PATCH /api/tasks/:id/priority
 * @access  Private
 */
const moveTaskPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task priority updated",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update priority",
      error: error.message
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Admin
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message
    });
  }
};

/**
 * @desc    Assign or reassign task to user
 * @route   PATCH /api/tasks/:id/assign
 * @access  Admin
 */
const assignTaskToUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign task",
      error: error.message
    });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  moveTaskPriority,
  deleteTask,
  assignTaskToUser
};
