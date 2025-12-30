const AssignUserModal = ({
  isOpen,
  users = [],
  selectedUser,
  onChange,
  onAssign,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Assign Task</h2>

        <select
          value={selectedUser || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-slate-200 hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={onAssign}
            disabled={!selectedUser}
            className={`px-4 py-2 text-sm rounded ${selectedUser ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal;
