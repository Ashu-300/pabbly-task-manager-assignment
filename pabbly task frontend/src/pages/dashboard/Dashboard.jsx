import { useEffect, useState } from "react";
import TaskList from "../../components/task/TaskList";
import api from "../../api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(null);
  const limit = 6;

  // Fetch first page
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPage = async (pageToFetch = 1, append = false) => {
    setLoading(true);
    try {
      // Dashboard overview should show all tasks regardless of assignment
      const res = await api.get(`/tasks?page=${pageToFetch}&limit=${limit}&all=true`);
      const fetched = res.data.tasks || [];
      setTotalPages(res.data.totalPages || 1);
      setTotalTasks(res.data.totalTasks ?? null);

      if (append) {
        setTasks((t) => [...t, ...fetched]);
      } else {
        setTasks(fetched);
      }

      setPage(pageToFetch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      fetchPage(page + 1, true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Dashboard</h1>

      <p className="text-slate-600 mb-6">Overview of tasks by priority and status</p>

      <TaskList tasks={tasks} loading={loading} />

      {page < totalPages && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
          >
            {loading ? "Loading…" : `Load next ${limit} tasks`}
          </button>
        </div>
      )}

      {totalTasks !== null && (
        <p className="text-sm text-slate-500 mt-3 text-center">Showing {tasks.length} of {totalTasks} tasks</p>
      )}
    </div>
  );
};

export default Dashboard;
