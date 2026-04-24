import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { ClipboardList, Wallet, BookOpen, Activity } from 'lucide-react';

const StudentDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await studentService.getDashboardMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error("Dashboard failed to retrieve metric payload", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Top Graphic Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-blue-100 max-w-xl">
            You're currently in excellent academic standing. Your next Clinical Verification cycle closes in 3 days.
          </p>
        </div>
        <div className="absolute top-0 right-0 opacity-10 scale-150 transform -translate-y-12 translate-x-12">
          <BookOpen strokeWidth={1} size={300} />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card 
          title="Overall Attendance" 
          value={`${metrics?.attendancePercent}%`} 
          subtext="Maintained across Phase 2" 
          icon={ClipboardList} 
          colorClass={metrics?.attendancePercent > 80 ? 'bg-emerald-500' : 'bg-red-500'} 
        />
        <Card 
          title="Pending Fees" 
          value={`$${metrics?.duesPending?.toLocaleString()}`} 
          subtext="Next Due: Hostel Accomm." 
          icon={Wallet} 
          colorClass="bg-red-500" 
        />
        <Card 
          title="Active Target Cases" 
          value={metrics?.activeClinicalLogs} 
          subtext="2 Pending Verifications" 
          icon={Activity} 
          colorClass="bg-indigo-600" 
        />
        <Card 
          title="Upcoming Exams" 
          value={metrics?.upcomingExams} 
          subtext="Internal Assessments" 
          icon={BookOpen} 
          colorClass="bg-blue-600" 
        />
      </div>

    </div>
  );
};

export default StudentDashboard;
