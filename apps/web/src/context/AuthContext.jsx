import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signUp, signOut } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, isPending: isLoading, error } = useSession();

  // Expose handy variables for components
  const user = session?.user || null;
  const isAuthenticated = !!user;

  // We wrap the auth actions to normalize parameters and error handling
  const login = async (email, password) => {
    return await signIn.email({
      email,
      password,
    });
  };

  const register = async (name, email, password) => {
    return await signUp.email({
      name,
      email,
      password,
    });
  };

  const logout = async () => {
    return await signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
