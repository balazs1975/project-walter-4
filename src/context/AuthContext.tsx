// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
// Completely commented out Firebase imports
// import {
//   User,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
// } from 'firebase/auth';
// import { auth, provider } from '../../firebase';

interface AuthCtx {
  user: any | null; // Changed from User to any to avoid Firebase types
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Mock user as always logged in to completely bypass authentication
  const [user, setUser] = useState<any>({ 
    uid: 'mock-user-123', 
    email: 'user@example.com',
    displayName: 'Mock User'
  });
  const [loading, setLoading] = useState(false); // Never loading since we're mocking

  // Completely commented out Firebase auth state listener
  // useEffect(
  //   () => onAuthStateChanged(auth, u => { setUser(u); setLoading(false); }),
  //   [],
  // );

  // Mock login function - no actual authentication
  const login = async () => {
    console.log('Mock login called - authentication completely disabled');
    // return signInWithPopup(auth, provider).then(() => void 0);
    setUser({ 
      uid: 'mock-user-123', 
      email: 'user@example.com',
      displayName: 'Mock User'
    });
    return Promise.resolve();
  };

  // Mock logout function
  const logout = async () => {
    console.log('Mock logout called - authentication completely disabled');
    // return signOut(auth).then(() => void 0);
    setUser(null);
    return Promise.resolve();
  };

  return (
    <Ctx.Provider value={{ user, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};