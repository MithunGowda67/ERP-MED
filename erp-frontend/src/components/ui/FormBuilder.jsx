import React, { useState } from 'react';

/**
 * Highly reusable dynamic form constructor for ERP scale endpoints.
 * @param {Array} fields - e.g. [{ name: 'email', label: 'Email', type: 'email', required: true }]
 * @param {Function} onSubmit - Form submission callback returning raw payload map.
 * @param {String} submitText - Label for submit button.
 */
const FormBuilder = ({ fields, onSubmit, submitText = 'Submit', loading = false }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExecute = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleExecute} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field, idx) => (
          <div key={idx} className={field.fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"}>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                rows={field.rows || 3}
                placeholder={field.placeholder || ''}
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                required={field.required}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white"
              >
                <option value="">{field.placeholder || 'Select an option'}</option>
                {field.options?.map((opt, oIdx) => (
                  <option key={oIdx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                required={field.required}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder={field.placeholder || ''}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Processing...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
