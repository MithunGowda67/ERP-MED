import api from './api';

export const staffService = {
  getStaffDashboard: async () => {
    // Mock simulation matching standard backend DTO returns
    return new Promise((resolve) => setTimeout(() => resolve({
      data: {
        assignedStudents: 45,
        pendingVerifications: 12,
        upcomingLectures: 3,
        leaveBalance: 14
      }
    }), 600));
  },

  getVerificationQueue: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { logId: 'log-100', studentName: 'Alex Mercer', department: 'ICU', caseType: 'Assist', submittedOn: '2026-04-24' },
        { logId: 'log-101', studentName: 'Sarah Jenkins', department: 'Pediatrics', caseType: 'Observation', submittedOn: '2026-04-22' }
      ]
    }), 800));
  }
};
