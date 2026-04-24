import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body Injection */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
