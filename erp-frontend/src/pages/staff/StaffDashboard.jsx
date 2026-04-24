import React, { useEffect, useState } from 'react';
import { staffService } from '../../services/staffService';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import DataTable from '../../components/ui/DataTable';
import { Users, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';

const StaffDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      staffService.getStaffDashboard(),
      staffService.getVerificationQueue()
    ]).then(([metricsRes, queueRes]) => {
      setMetrics(metricsRes.data);
      setQueue(queueRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  const columns = [
    { header: 'Log ID', accessor: 'logId' },
    { header: 'Student Identity', accessor: 'studentName' },
    { header: 'Rotational Dept', accessor: 'department' },
    { header: 'Exposure Level', accessor: 'caseType' },
    { header: 'Pushed On', accessor: 'submittedOn' },
    { 
      header: 'Action', 
      render: (row) => (
        <button className="text-blue-600 hover:text-blue-800 font-bold tracking-tight uppercase text-xs">
          Verify Case
        </button>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Assigned Students" 
          value={metrics?.assignedStudents} 
          subtext="Under your guidance cohort" 
          icon={Users} 
          colorClass="bg-blue-600" 
        />
        <Card 
          title="Pending Log Verifications" 
          value={metrics?.pendingVerifications} 
          subtext="Requires signature checks" 
          icon={ShieldCheck} 
          colorClass="bg-amber-500" 
        />
        <Card 
          title="Upcoming Lectures" 
          value={metrics?.upcomingLectures} 
          subtext="Next 48 Hours" 
          icon={Calendar} 
          colorClass="bg-indigo-600" 
        />
        <Card 
          title="Leave Balance" 
          value={metrics?.leaveBalance} 
          subtext="Approved HR accrual" 
          icon={CheckCircle} 
          colorClass="bg-emerald-500" 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-amber-500" /> Action Required: Clinical Verifications
          </h2>
          <p className="text-slate-500 text-sm mt-1">Review the anonymized case logs submitted by your assigned students.</p>
        </div>
        <DataTable columns={columns} data={queue} pagination={false} />
      </div>

    </div>
  );
};

export default StaffDashboard;
