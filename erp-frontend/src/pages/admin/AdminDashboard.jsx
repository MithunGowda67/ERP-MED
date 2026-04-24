import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import DataTable from '../../components/ui/DataTable';
import { Users, Banknote, ClipboardList, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getSystemMetrics(),
      adminService.getRecentAdmissions()
    ]).then(([metricsRes, admissionsRes]) => {
      setMetrics(metricsRes.data);
      setAdmissions(admissionsRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader fullScreen />;

  const tableColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Applicant Name', accessor: 'name' },
    { header: 'Program', accessor: 'course' },
    { header: 'Submission Date', accessor: 'date' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Master Analytics</h1>
        <button className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
          Generate Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Enrollment" 
          value={metrics?.totalStudents.toLocaleString()} 
          subtext="Across all phases" 
          icon={Users} 
          colorClass="bg-blue-600" 
        />
        <Card 
          title="Global Collection (YTD)" 
          value={`$${(metrics?.feeCollectionYTD / 1000000).toFixed(1)}M`} 
          subtext="12% higher than Q1" 
          icon={Banknote} 
          colorClass="bg-emerald-500" 
        />
        <Card 
          title="System Attendance Avg" 
          value={`${metrics?.avgAttendance}%`} 
          subtext="Healthy parameter threshold" 
          icon={ClipboardList} 
          colorClass="bg-indigo-500" 
        />
        <Card 
          title="Staff Availability" 
          value={metrics?.totalStaff} 
          subtext="Active system users" 
          icon={Activity} 
          colorClass="bg-amber-500" 
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Admission Applications</h2>
        <DataTable columns={tableColumns} data={admissions} pagination={true} />
      </div>
    </div>
  );
};

export default AdminDashboard;
