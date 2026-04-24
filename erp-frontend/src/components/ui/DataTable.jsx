import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const DataTable = ({ columns, data, pagination = true }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
        No records found matching constraints.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold tracking-wide text-slate-500 uppercase">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 text-sm font-medium text-slate-700">
                    {/* Render function passed in column definition, or direct mapped key */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Viewing Phase constraints</p>
          <div className="flex gap-2">
            <button className="p-1 rounded bg-white border border-slate-300 text-slate-500 hover:bg-slate-100 transition disabled:opacity-50" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 rounded bg-white border border-slate-300 text-slate-500 hover:bg-slate-100 transition disabled:opacity-50" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
