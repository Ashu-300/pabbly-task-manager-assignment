import { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  const [goto, setGoto] = useState("");

  if (totalPages <= 1) return null;

  const gotoPage = () => {
    const p = parseInt(goto, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
      setGoto("");
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 text-sm rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 text-sm rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Page size:</label>
        <select value={pageSize} onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))} className="border rounded px-2 py-1">
          <option value={5}>5</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Go to:</label>
        <input type="number" min={1} max={totalPages} value={goto} onChange={(e) => setGoto(e.target.value)} className="w-20 border rounded px-2 py-1" />
        <button onClick={gotoPage} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Go</button>
      </div>
    </div>
  );
};

export default Pagination;
