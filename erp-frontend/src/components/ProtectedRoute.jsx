import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();

  // 1. Kick bouncing unauthenticated visitors immediately
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Lockout authenticated visitors lacking specific roles mapped in our ERP
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50 text-red-900 border-red-500">
        <div className="p-8 bg-white border border-red-200 shadow-xl rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">403 Forbidden</h2>
          <p>Your current assigned ERP role ({userRole || 'UNKNOWN'}) lacks privileges to cross this domain.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
