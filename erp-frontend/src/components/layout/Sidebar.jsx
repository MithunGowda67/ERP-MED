import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ menuItems, title }) => {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="h-16 flex items-center justify-center font-bold text-xl text-white tracking-widest border-b border-slate-700">
        {title}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {Icon && <Icon size={20} />}
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
