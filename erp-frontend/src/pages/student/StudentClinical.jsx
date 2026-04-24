import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import { PlusCircle, Activity } from 'lucide-react';

const StudentClinical = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentService.getClinicalLogs().then(res => {
      setLogs(res.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate real post behavior mimicking backend Schema
    await studentService.submitClinicalLog({});
    setLogs([{ id: 'newTemp', date: new Date().toISOString().split('T')[0], department: 'Trauma', caseType: 'Assist', status: 'PENDING' }, ...logs]);
    setSubmitting(false);
    e.target.reset();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* 1/3 Width: Submission Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 col-span-1 h-fit">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <PlusCircle className="text-blue-600" />
          Log New Case
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input type="text" required className="w-full border border-slate-300 rounded-lg p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Case Type / Exposure</label>
            <select required className="w-full border border-slate-300 rounded-lg p-2 outline-none">
              <option value="">Select Type</option>
              <option value="OBSERVATION">Observation</option>
              <option value="ASSIST">Surgical Assist</option>
              <option value="INDEPENDENT">Independent Routine</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes (Anonymized)</label>
            <textarea required rows="4" className="w-full border border-slate-300 rounded-lg p-2 outline-none" placeholder="Do not include real Patient PII natively..."></textarea>
          </div>
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {submitting ? 'Submitting Log...' : 'Push to Faculty Server'}
          </button>
        </form>
      </div>

      {/* 2/3 Width: Log History Data Table Mock */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 col-span-1 lg:col-span-2 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" /> My Log Registry
          </h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-sm tracking-wide border-b border-slate-200">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm text-slate-700 font-medium">{log.date}</td>
                  <td className="p-4 text-sm text-slate-600">{log.department}</td>
                  <td className="p-4 text-sm text-slate-600">{log.caseType}</td>
                  <td className="p-4 text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${log.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <div className="p-8 text-center text-slate-400 font-medium">No logs recorded yet.</div>}
        </div>
      </div>

    </div>
  );
};

export default StudentClinical;
