import TaskCard from "./TaskCard";
import Loader from "../common/Loader";

const TaskList = ({ tasks = [], loading = false, isAdmin = false, onDelete }) => {
  if (loading) {
    return <Loader />;
  }

  if (!tasks.length) {
    return (
      <p className="text-center text-slate-500 mt-6">No tasks found</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} isAdmin={isAdmin} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
