import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormBuilder from '../../components/ui/FormBuilder';
import { Wallet, CheckCircle } from 'lucide-react';

const StudentFees = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFee, setActiveFee] = useState(null); // Triggers Modal if defined
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    studentService.getFeeLedger().then(res => {
      setLedger(res.data);
      setLoading(false);
    });
  }, []);

  const totalPending = ledger
    .filter(f => f.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handlePaymentSubmit = async (payload) => {
    setProcessing(true);
    await studentService.processPayment(activeFee.id, payload);
    
    // Optimistic UI state update locally natively
    setLedger(prev => prev.map(f => f.id === activeFee.id ? { ...f, status: 'PAID' } : f));
    setProcessing(false);
    setActiveFee(null); // Close modal automatically
  };

  if (loading) return <Loader />;

  const columns = [
    { header: 'Demand Type', accessor: 'type' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Required Amount', render: (row) => <span className="font-bold text-slate-800">${row.amount.toLocaleString()}</span> },
    { 
      header: 'Fulfillment Status', 
      render: (row) => (
        row.status === 'PAID' ? 
          <span className="flex items-center gap-1 text-emerald-600 font-bold tracking-tight text-xs uppercase"><CheckCircle size={14}/> Complete</span> :
          <button 
             onClick={() => setActiveFee(row)}
             className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold tracking-wider hover:bg-blue-700 transition"
          >
             Pay Now
          </button>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Dynamic Header syncing purely to local array calculations */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
             <Wallet className="text-amber-400" /> My Financial Ledger
           </h1>
           <p className="text-slate-400 mt-1">Review securely billed semesters and hostel triggers</p>
        </div>
        <div className="text-right">
           <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Outstanding</p>
           <p className="text-4xl font-bold text-emerald-400">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
        <DataTable columns={columns} data={ledger} pagination={true} />
      </div>

      {/* Reusable Modal specifically isolated to render the highly abstract FormBuilder structure! */}
      <Modal 
        isOpen={!!activeFee} 
        onClose={() => setActiveFee(null)} 
        title={`Complete Transaction: ${activeFee?.type}`}
        maxWidth="max-w-md"
      >
        <p className="text-sm text-slate-500 mb-6 font-medium">
          You are securely attempting to fulfill a balance exactly matching <span className="font-bold text-slate-900">${activeFee?.amount.toLocaleString()}</span>. 
          Please input dummy stripe details below to simulate local dev execution.
        </p>

        <FormBuilder 
          loading={processing}
          submitText="Process $ Payment"
          onSubmit={handlePaymentSubmit}
          fields={[
             { name: 'name', label: 'Cardholder Name', type: 'text', required: true, fullWidth: true },
             { name: 'cc', label: '16-Digit Card Number', type: 'text', placeholder: 'xxxx xxxx xxxx xxxx', required: true, fullWidth: true },
             { name: 'exp', label: 'Expiry (MM/YY)', type: 'text', required: true },
             { name: 'cvv', label: 'CVV', type: 'text', required: true }
          ]}
        />
      </Modal>

    </div>
  );
};

export default StudentFees;
