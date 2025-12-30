const ConfirmModal = ({ isOpen, title = "Confirm", message = "Are you sure?", onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded bg-slate-200 hover:bg-slate-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;