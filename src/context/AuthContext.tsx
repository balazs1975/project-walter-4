// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
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
  // Mock user as logged in to bypass authentication
  const [user, setUser] = useState<any>({ uid: 'mock-user', email: 'user@example.com' });
  const [loading, setLoading] = useState(false); // Set to false since we're mocking

  // Comment out Firebase auth state listener
  // useEffect(
  //   () => onAuthStateChanged(auth, u => { setUser(u); setLoading(false); }),
  //   [],
  // );

  // Mock login function
  const login = async () => {
    // return signInWithPopup(auth, provider).then(() => void 0);
    console.log('Mock login - authentication disabled');
    setUser({ uid: 'mock-user', email: 'user@example.com' });
  };

  // Mock logout function
  const logout = async () => {
    // return signOut(auth).then(() => void 0);
    console.log('Mock logout - authentication disabled');
    setUser(null);
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