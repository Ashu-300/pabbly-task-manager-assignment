import { useEffect, useState } from "react";
import TaskList from "../../components/task/TaskList";
import api from "../../api";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks assigned to logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tasks/my-tasks");
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        My Tasks
      </h1>

      <TaskList tasks={tasks} loading={loading} />
    </div>
  );
};

export default MyTasks; 
