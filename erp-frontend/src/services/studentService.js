import api from './api';

export const studentService = {
  getDashboardMetrics: async () => {
    // In production, this targets the actual backend endpoints we built utilizing our Bearer token
    // Example: const res = await api.get('/academic/attendance/overview');
    
    // For scaffolding UI reliability before full local integration, 
    // we simulate the exact expected HTTP payload structures:
    return new Promise((resolve) => setTimeout(() => resolve({
      data: {
        attendancePercent: 88.5,
        duesPending: 50000,
        upcomingExams: 2,
        activeClinicalLogs: 4
      }
    }), 800));
  },
  
  getClinicalLogs: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { id: 'log1', date: '2024-03-22', department: 'Cardiology', caseType: 'Observation', status: 'PENDING' },
        { id: 'log2', date: '2024-03-15', department: 'Pediatrics', caseType: 'Assist', status: 'VERIFIED' }
      ]
    }), 600));
  },

  submitClinicalLog: async (logData) => {
    // Actual API Call: return api.post('/clinical/logs', logData);
    return new Promise((resolve) => setTimeout(() => resolve({
      message: 'Log Successfully submitted', id: 'log3'
    }), 800));
  },

  getFeeLedger: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { id: 'FEE-881', type: 'Tuition Phase 1', amount: 45000, status: 'PAID', dueDate: '2026-01-15' },
        { id: 'FEE-882', type: 'Hostel Fee 2026', amount: 5000, status: 'PENDING', dueDate: '2026-05-30' }
      ]
    }), 600));
  },

  processPayment: async (feeId, ccPayload) => {
    console.log(`Secured mock payment tunnel for fee: ${feeId}`, ccPayload);
    return new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 1500));
  }
};
