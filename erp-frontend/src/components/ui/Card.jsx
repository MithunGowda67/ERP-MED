import React from 'react';

const Card = ({ title, value, subtext, icon: Icon, colorClass = "bg-blue-600" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg text-white ${colorClass}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {subtext && (
        <p className="text-sm font-medium text-slate-400 mt-4 border-t border-slate-100 pt-3">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default Card;
