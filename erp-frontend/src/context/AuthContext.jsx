import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listens silently for Session updates across the Browser (Persisted logins, etc)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Grab token and securely push to localStorage making `api.js` interceptor life easy
        const token = await user.getIdToken();
        localStorage.setItem('erp_token', token);
        
        try {
          // Cross-reference Firebase Auth ID with our strict Firestore /identity DB entry 
          const response = await api.get('/identity/profile');
          setUserRole(response.data.data.role); // e.g. "student", "admin"
        } catch (error) {
          console.error("Failed executing role-resolution:", error);
          setUserRole('UNAUTHORIZED');
        }
        
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        localStorage.removeItem('erp_token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const devLogin = (mockRole) => {
    setCurrentUser({ uid: 'local-dev-user', email: 'dev@localhost' });
    setUserRole(mockRole);
  };

  const value = {
    currentUser,
    userRole,
    devLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
