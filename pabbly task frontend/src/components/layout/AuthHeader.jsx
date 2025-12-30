import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthHeader = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 shadow">
      <h1 className="text-lg font-semibold tracking-wide">
        <Link to="/" className="hover:opacity-90">
          Task<span className="text-blue-400">Manager</span>
        </Link>
      </h1>

      <nav className="flex items-center space-x-4">
        <Link to="/" className="text-sm px-3 py-2 rounded hover:bg-slate-700">Dashboard</Link>
        <Link to="/my-tasks" className="text-sm px-3 py-2 rounded hover:bg-slate-700">My Tasks</Link>
        <Link to="/tasks/create" className="text-sm px-3 py-2 rounded hover:bg-slate-700">Create Task</Link>
        {isAdmin && <Link to="/admin/tasks" className="text-sm px-3 py-2 rounded hover:bg-slate-700">Admin</Link>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default AuthHeader;
