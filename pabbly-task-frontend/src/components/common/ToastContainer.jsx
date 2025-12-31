import React from "react";
import { useToast } from "../../context/ToastContext";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow text-sm max-w-xs break-words ${
            t.type === "success" ? "bg-green-500 text-white" : t.type === "error" ? "bg-red-500 text-white" : "bg-slate-800 text-white"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>{t.message}</div>
            <button onClick={() => removeToast(t.id)} className="ml-4 font-bold">×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;