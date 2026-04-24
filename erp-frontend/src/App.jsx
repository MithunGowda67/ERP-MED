import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';
import StudentLayout from './layouts/StudentLayout';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentClinical from './pages/student/StudentClinical';
import StudentFees from './pages/student/StudentFees';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFees from './pages/admin/AdminFees';
import AdminHostel from './pages/admin/AdminHostel';

import StaffDashboard from './pages/staff/StaffDashboard';

const LoginStub = () => {
  const { devLogin } = useAuth();
  const nav = useNavigate();

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-100 gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">ERP Simulator</h1>
        <p className="text-slate-500 mt-2">Bypass Firebase securely for local structural review</p>
      </div>
      <div className="flex gap-4">
         <button onClick={() => { devLogin('admin'); nav('/admin'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition">Boot Admin</button>
         <button onClick={() => { devLogin('staff'); nav('/staff'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition">Boot Faculty</button>
         <button onClick={() => { devLogin('student'); nav('/student'); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition">Boot Student</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Logic */}
          <Route path="/login" element={<LoginStub />} />

          {/* Admin Role Scope */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="hostel" element={<AdminHostel />} />
          </Route>

          {/* Staff Role Scope */}
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StaffDashboard />} />
          </Route>

          {/* Student Role Scope */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="clinical" element={<StudentClinical />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="*" element={<h2 className="p-4 text-slate-500">Feature pending UI development...</h2>} />
          </Route>

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
