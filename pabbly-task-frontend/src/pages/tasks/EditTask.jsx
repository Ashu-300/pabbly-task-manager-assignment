import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../context/ToastContext";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tasks/${id}`);
        const task = res.data.task;
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
        setPriority(task.priority || "medium");
      } catch (err) {
        console.error(err);
        addToast("error", "Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${id}`, { title, description, dueDate, priority });
      addToast("success", "Task updated successfully");
      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error(err);
      addToast("error", err.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) return <p>Loading…</p>;
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Edit Task</h1>

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
            value={dueDate}
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

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask; 
