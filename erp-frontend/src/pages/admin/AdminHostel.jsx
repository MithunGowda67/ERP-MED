import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/ui/Loader';
import { Building, Users, BedDouble } from 'lucide-react';

const AdminHostel = () => {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getHostelMatrix().then(res => {
      setMatrix(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader fullScreen />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'FULL': return 'bg-red-500 text-white';
      case 'PARTIAL': return 'bg-amber-400 text-amber-900';
      case 'EMPTY': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <Building className="text-indigo-600" size={32} />
             Hostel Occupancy Matrix
           </h1>
           <p className="text-slate-500 mt-2 tracking-wide font-medium">Real-time room allocation status natively synced</p>
         </div>
      </div>

      {/* Visual Room Layout mapped cleanly in Tailwind CSS Grid natively */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {matrix.map((room) => (
          <div key={room.id} className={`${getStatusColor(room.status)} p-4 rounded-xl shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer relative overflow-hidden`}>
            
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-lg opacity-90">{room.number}</span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 px-2 py-0.5 rounded-full bg-black/10">Block {room.block}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between flex-row items-center text-sm font-medium opacity-90">
                <span className="flex items-center gap-1"><BedDouble size={14} /> Cap:</span>
                <span>{room.capacity}</span>
              </div>
              <div className="flex justify-between flex-row items-center text-sm font-bold opacity-100">
                <span className="flex items-center gap-1"><Users size={14} /> Occ:</span>
                <span>{room.occupants}</span>
              </div>
            </div>
            
            {/* Background Icon Watermark */}
            <BedDouble className="absolute -bottom-2 -right-2 opacity-10 scale-150" size={80} />
          </div>
        ))}
      </div>

      <div className="bg-slate-100 p-4 rounded-xl flex gap-6 text-sm font-bold text-slate-600 justify-center">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span> Completely Vacant</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></span> Partially Filled</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span> At Capacity Array</span>
      </div>

    </div>
  );
};

export default AdminHostel;
