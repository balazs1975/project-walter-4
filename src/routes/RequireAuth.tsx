// src/routes/RequireAuth.tsx
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import LoginModal from '../components/LoginModal';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  // const [modal, setModal]  = useState(false);
  const location           = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-purple-500" />
      </div>
    );
  }

  // Comment out authentication requirement - always allow access
  // if (!user) {
  //   if (!modal) setModal(true);
  //   return (
  //     <>
  //       <LoginModal open={modal} onClose={() => setModal(false)} />
  //       <Navigate to="/" state={{ from: location }} replace />
  //     </>
  //   );
  // }

  // Always render children without authentication check
  return children;
};

export default RequireAuth;