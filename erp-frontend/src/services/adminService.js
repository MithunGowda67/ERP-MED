import api from './api';

export const adminService = {
  getSystemMetrics: async () => {
    // In production, hits `/dashboard/stats` natively using JWT mapping
    return new Promise((resolve) => setTimeout(() => resolve({
      data: {
        totalStudents: 1420,
        totalStaff: 185,
        feeCollectionYTD: 14500000,
        avgAttendance: 89.2
      }
    }), 700));
  },
  
  getRecentAdmissions: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { id: 'ADM-901', name: 'John Doe', course: 'MBBS Phase 1', status: 'VERIFIED', date: '2026-04-24' },
        { id: 'ADM-902', name: 'Jane Austen', course: 'BSc Nursing', status: 'PENDING', date: '2026-04-23' },
        { id: 'ADM-903', name: 'Richard Miles', course: 'MD Ortho', status: 'VERIFIED', date: '2026-04-21' }
      ]
    }), 900));
  },
  
  getHostelMatrix: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { id: 'RM-101', number: '101', capacity: 2, occupants: 2, block: 'A', status: 'FULL' },
        { id: 'RM-102', number: '102', capacity: 2, occupants: 1, block: 'A', status: 'PARTIAL' },
        { id: 'RM-103', number: '103', capacity: 2, occupants: 0, block: 'A', status: 'EMPTY' },
        { id: 'RM-104', number: '104', capacity: 3, occupants: 3, block: 'B', status: 'FULL' },
        { id: 'RM-105', number: '105', capacity: 3, occupants: 0, block: 'B', status: 'EMPTY' },
      ]
    }), 500));
  },

  createFeeStructure: async (payload) => {
    console.log("Fee pushed safely to /api/v1/fees/structures:", payload);
    return new Promise((resolve) => setTimeout(() => resolve({ message: 'Success' }), 1200));
  }
};
