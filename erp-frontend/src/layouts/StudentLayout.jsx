import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { Home, ClipboardList, Wallet, Calendar, Activity, BookOpen, Bell } from 'lucide-react';

const StudentLayout = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/student', icon: Home },
    { label: 'Profile', path: '/student/profile', icon: BookOpen },
    { label: 'Attendance', path: '/student/attendance', icon: ClipboardList },
    { label: 'Fees & Dues', path: '/student/fees', icon: Wallet },
    { label: 'Timetable', path: '/student/timetable', icon: Calendar },
    { label: 'Clinical Logs', path: '/student/clinical', icon: Activity },
    { label: 'Exams & Results', path: '/student/exams', icon: BookOpen },
    { label: 'Notifications', path: '/student/notifications', icon: Bell }
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar menuItems={menuItems} title="ERP STUDENT" />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar pageTitle="Student Portal" />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Child routes inject natively here keeping layout stateful */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
