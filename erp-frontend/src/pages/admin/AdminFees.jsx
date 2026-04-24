import React, { useState } from 'react';
import FormBuilder from '../../components/ui/FormBuilder';
import { adminService } from '../../services/adminService';
import { CreditCard, CheckCircle } from 'lucide-react';

const AdminFees = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mapped schema config to automatically spin up complex forms securely
  const feeFormConfig = [
    { name: 'name', label: 'Fee Structure Name', type: 'text', placeholder: 'e.g. MBBS Tuition 2026 Phase 1', required: true, fullWidth: true },
    { name: 'amount', label: 'Base Amount Currency ($)', type: 'number', placeholder: '50000', required: true },
    { name: 'dueDate', label: 'Enforced Due Date', type: 'date', required: true },
    { name: 'batch', label: 'Target Batch Array', type: 'select', options: [
      {label: 'MBBS Cohort 2026', value: 'mbbs_26'},
      {label: 'Nursing Group Q3', value: 'nurs_q3'}
    ], required: true },
    { name: 'notes', label: 'Accounting Notes', type: 'textarea', placeholder: 'Applies only for day scholars natively...', fullWidth: true }
  ];

  const handleStructureCreation = async (payload) => {
    setLoading(true);
    await adminService.createFeeStructure(payload);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4">
         <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
           <CreditCard className="text-emerald-600" size={32} />
           Fee Generation Matrix
         </h1>
         <p className="text-slate-500 mt-2 tracking-wide font-medium">Broadcast massive demand arrays to active matching subcollections</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        {success && (
          <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white py-3 px-6 text-sm font-bold tracking-widest uppercase flex justify-center items-center gap-2 animate-in slide-in-from-top-full">
            <CheckCircle size={18} /> Financial Structuring Propagated Effectively
          </div>
        )}
        
        <div className={`transition-opacity ${success ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
           <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-3">New Demand Blueprint</h2>
           <FormBuilder 
              fields={feeFormConfig} 
              onSubmit={handleStructureCreation} 
              submitText="Broadcast Fee to Ledger" 
              loading={loading}
           />
        </div>
      </div>
    </div>
  );
};

export default AdminFees;
