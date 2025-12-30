import { Link } from "react-router-dom";

const TaskCard = ({ task, isAdmin = false, onDelete }) => {
  if (!task) return null;

  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
      <div className="flex items-start justify-between">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-800">
          <Link to={`/tasks/${task._id}`}>{task.title}</Link>
        </h3>

        {/* Admin actions */}
        {isAdmin && onDelete && (
          <div className="flex items-center gap-2">
            <Link to={`/tasks/${task._id}/edit`} className="text-xs px-2 py-1 rounded bg-indigo-600 text-white">Edit</Link>
            <button
              onClick={() => onDelete(task._id)}
              className="text-xs px-2 py-1 rounded bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
      )}

      {/* Meta info */}
      <div className="flex items-center justify-between mt-4">
        {/* Priority */}
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            priorityColors[task.priority] || "bg-slate-200 text-slate-700"
          }`}
        >
          {task.priority?.toUpperCase()}
        </span>

        {/* Status */}
        <span
          className={`text-xs font-semibold ${
            task.status === "completed" ? "text-green-600" : "text-orange-600"
          }`}
        >
          {task.status?.toUpperCase()}
        </span>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <p className="text-xs text-slate-500 mt-2">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default TaskCard; 
