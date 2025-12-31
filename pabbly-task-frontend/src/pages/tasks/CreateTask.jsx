import { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const { addToast } = useToast();

  // today's date in YYYY-MM-DD (suitable for date input min)
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users || []);
      } catch (err) {
        // If backend restricts access, we silently ignore and allow unassigned creation
        console.error(err);
        addToast("error", "Failed to load users for assignment");
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation: due date must not be in the past
    if (!dueDate) {
      addToast("error", "Please select a due date");
      return;
    }

    if (new Date(dueDate) < new Date(todayStr)) {
      addToast("error", "Due date cannot be in the past");
      return;
    }

    try {
      const payload = { title, description, dueDate, priority };
      if (assignedTo) payload.assignedTo = assignedTo;

      await api.post("/tasks", payload);
      addToast("success", "Task created successfully");
      navigate("/my-tasks");
    } catch (err) {
      console.error(err);
      addToast("error", err.response?.data?.message || "Failed to create task");
    }
  };
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        Create Task
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-3">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Due Date</label>
          <input
            type="date"
            required
            value={dueDate}
            min={todayStr}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Assign To</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask; 
