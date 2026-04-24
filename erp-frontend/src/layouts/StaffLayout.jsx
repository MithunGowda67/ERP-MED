import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { Home, Users, CheckSquare, Award, Clock, Calendar, Bell } from 'lucide-react';

const StaffLayout = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/staff', icon: Home },
    { label: 'My Students', path: '/staff/students', icon: Users },
    { label: 'Mark Attendance', path: '/staff/attendance', icon: CheckSquare },
    { label: 'Internal Assessment', path: '/staff/ia', icon: Award },
    { label: 'Log Verification', path: '/staff/clinical-verify', icon: Clock },
    { label: 'Time Table', path: '/staff/timetable', icon: Calendar },
    { label: 'Leave Requests', path: '/staff/leaves', icon: CheckSquare },
    { label: 'Alerts', path: '/staff/notifications', icon: Bell },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar menuItems={menuItems} title="ERP STAFF" />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar pageTitle="Faculty Portal" />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
