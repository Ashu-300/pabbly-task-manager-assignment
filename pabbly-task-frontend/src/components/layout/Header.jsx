import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow">
      <h1 className="text-lg font-semibold tracking-wide">
        <Link to="/" className="hover:opacity-90">
          Task<span className="text-blue-400">Manager</span>
        </Link>
      </h1>

      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      ) : (
        <div className="space-x-2">
          <Link to="/login" className="text-sm px-3 py-2 bg-blue-600 rounded hover:opacity-90">
            Login
          </Link>
          <Link to="/register" className="text-sm px-3 py-2 bg-green-600 rounded hover:opacity-90">
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
