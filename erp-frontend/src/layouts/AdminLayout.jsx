import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { Home, UserPlus, Users, Banknote, Building, FileText, Database, Settings } from 'lucide-react';

const AdminLayout = () => {
  const menuItems = [
    { label: 'Master Analytics', path: '/admin', icon: Home },
    { label: 'Admissions', path: '/admin/admissions', icon: UserPlus },
    { label: 'Students Directory', path: '/admin/students', icon: Users },
    { label: 'Staff & HR', path: '/admin/staff', icon: Users },
    { label: 'Fee Management', path: '/admin/fees', icon: Banknote },
    { label: 'Hostel Matrix', path: '/admin/hostel', icon: Building },
    { label: 'Examinations', path: '/admin/exams', icon: FileText },
    { label: 'Store & Inventory', path: '/admin/store', icon: Database },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar menuItems={menuItems} title="ERP ADMIN" />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar pageTitle="Administrative Operations" />
        <main className="flex-1 p-8 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
