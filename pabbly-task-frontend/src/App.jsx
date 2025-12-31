import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import AuthHeader from "./components/layout/AuthHeader";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import MyTasks from "./pages/dashboard/MyTasks";
import CreateTask from "./pages/tasks/CreateTask";
import TaskDetails from "./pages/tasks/TaskDetails";
import EditTask from "./pages/tasks/EditTask";
import AllTasks from "./pages/admin/AllTasks";
import Users from "./pages/admin/Users";
import AdminRoute from "./components/common/AdminRoute";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated ? <AuthHeader /> : <Header /> }

        <main className="flex-1 container mx-auto p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/tasks/:id/edit" element={<EditTask />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin/tasks" element={<AllTasks />} />
                <Route path="/admin/users" element={<Users />} />
              </Route>
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
