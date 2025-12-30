const PriorityBadge = ({ priority }) => {
  const colors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        colors[priority] || "bg-slate-200 text-slate-700"
      }`}
    >
      {priority ? priority.toUpperCase() : "N/A"}
    </span>
  );
};

export default PriorityBadge;
