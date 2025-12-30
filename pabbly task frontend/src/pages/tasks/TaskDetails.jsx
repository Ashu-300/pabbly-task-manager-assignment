import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PriorityBadge from "../../components/task/PriorityBadge";
import AssignUserModal from "../../components/task/AssignUserModal";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data.task);
      } catch (err) {
        console.error(err);
        addToast("error", "Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const { addToast } = useToast();

  const toggleStatus = async () => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      setTask(res.data.task);
      addToast("success", "Status updated");
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to update status");
    }
  };

  const changePriority = async (p) => {
    try {
      const res = await api.patch(`/tasks/${id}/priority`, { priority: p });
      setTask(res.data.task);
      addToast("success", "Priority changed");
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to change priority");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/tasks/${id}`);
      addToast("success", "Task deleted");
      navigate(isAdmin ? "/admin/tasks" : "/my-tasks");
    } catch (err) {
      console.error(err);
      addToast("error", err.response?.data?.message || "Failed to delete task");
    }
  };

  const openAssign = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
      setIsAssignOpen(true);
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to load users");
    }
  };

  const handleAssignConfirmed = async () => {
    try {
      await api.patch(`/tasks/${id}/assign`, { userId: selectedUser });
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data.task);
      setIsAssignOpen(false);
      setSelectedUser("");
      addToast("success", "Task assigned");
    } catch (err) {
      console.error(err);
      addToast("error", "Failed to assign user");
    }
  };

  if (loading || !task) return <p>Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Task Details</h1>
            <div className="flex gap-2">
            <Link to={`/tasks/${id}/edit`} className="px-3 py-1 rounded bg-indigo-600 text-white">Edit</Link>
            <button onClick={toggleStatus} className="px-3 py-1 rounded bg-yellow-600 text-white">{task.status === "completed" ? "Mark Pending" : "Mark Completed"}</button>
            {isAdmin && <button onClick={openAssign} className="px-3 py-1 rounded bg-blue-600 text-white">Assign</button>}
            {isAdmin && <button onClick={() => { setConfirmPayload({ action: 'delete' }); setConfirmOpen(true); }} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>}
          </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-slate-800">{task.title}</h2>
        <p className="text-sm text-slate-600 mt-2">{task.description}</p>

        <div className="flex items-center gap-4 mt-4">
          <PriorityBadge priority={task.priority} />
          <span className="text-sm text-slate-500">Status: {task.status.toUpperCase()}</span>
          <span className="text-sm text-slate-500">Due Date: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm">Change Priority:</label>
          <select value={task.priority} onChange={(e) => changePriority(e.target.value)} className="border rounded px-2 py-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {task.assignedTo && (
          <div className="mt-4 text-sm text-slate-600">Assigned to: {task.assignedTo.name} ({task.assignedTo.email})</div>
        )}
      </div>

      <AssignUserModal
        isOpen={isAssignOpen}
        users={users}
        selectedUser={selectedUser}
        onChange={setSelectedUser}
        onAssign={() => { setConfirmPayload({ action: 'assign' }); setConfirmOpen(true); }}
        onClose={() => setIsAssignOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmPayload?.action === 'delete' ? 'Delete Task' : 'Confirm Assignment'}
        message={
          confirmPayload?.action === 'delete'
            ? 'Are you sure you want to delete this task? This cannot be undone.'
            : (selectedUser ? `Assign this task to ${users.find(u => u._id === selectedUser)?.name || 'selected user'}?` : 'No user selected')
        }
        onConfirm={() => {
          if (confirmPayload?.action === 'delete') {
            handleDeleteConfirmed();
          } else if (confirmPayload?.action === 'assign') {
            handleAssignConfirmed();
          }
          setConfirmOpen(false);
          setConfirmPayload(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmPayload(null);
        }}
      />
    </div>
  );
};

export default TaskDetails;
