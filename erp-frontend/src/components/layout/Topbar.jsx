import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ pageTitle }) => {
  const { userRole } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{pageTitle || "Dashboard"}</h2>
      
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {userRole} Profile
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
