import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, message = "Loading securely..." }) => {
  const containerClass = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen w-full bg-slate-50" 
    : "flex flex-col items-center justify-center p-12";

  return (
    <div className={containerClass}>
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
      <span className="text-sm font-medium text-slate-500 tracking-wider uppercase">
        {message}
      </span>
    </div>
  );
};

export default Loader;
