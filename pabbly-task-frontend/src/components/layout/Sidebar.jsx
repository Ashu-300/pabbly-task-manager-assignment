import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <aside className="w-64 bg-slate-100 border-r min-h-screen p-4">
      <nav className="space-y-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/my-tasks" className={linkClass}>
          My Tasks
        </NavLink>

        <NavLink to="/tasks/create" className={linkClass}>
          Create Task
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin/tasks" className={linkClass}>
            All Tasks
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
