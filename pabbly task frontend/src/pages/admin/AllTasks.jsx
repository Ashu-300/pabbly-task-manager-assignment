import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TaskList from "../../components/task/TaskList";
import Pagination from "../../components/common/Pagination";
import api from "../../api";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/common/ConfirmModal";

const AllTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initPage = parseInt(searchParams.get("page") || "1", 10);
  const initPageSize = parseInt(searchParams.get("limit") || "9", 10);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initPage);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const { addToast } = useToast();

  const fetchTasks = async (p = page, size = pageSize) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks?page=${p}&limit=${size}`);
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sync page & pageSize with URL so returning from details preserves state
  useEffect(() => {
    const params = {};
    if (page && page !== 1) params.page = page;
    if (pageSize && pageSize !== 9) params.limit = pageSize;
    setSearchParams(params);
    // fetch when we update params
    fetchTasks(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handlePageChange = (p) => setPage(p);

  const promptDelete = (id) => {
    setTargetDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!targetDeleteId) return;
    try {
      await api.delete(`/tasks/${targetDeleteId}`);
      addToast("success", "Task deleted");
      // Refresh list (keeps page same)
      fetchTasks(page, pageSize);
    } catch (err) {
      console.error(err);
      addToast("error", err.response?.data?.message || "Failed to delete task");
    } finally {
      setConfirmOpen(false);
      setTargetDeleteId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">All Tasks</h1>

      <TaskList tasks={tasks} loading={loading} isAdmin={true} onDelete={promptDelete} />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => { setConfirmOpen(false); setTargetDeleteId(null); }}
      />
    </div>
  );
};

export default AllTasks; 
