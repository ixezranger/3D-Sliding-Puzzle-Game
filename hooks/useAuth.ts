
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

// Mock user data for the simulation
const MOCK_USER: User = {
  name: 'Puzzle Master',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocK8A1p-E-SRs2p_3_1aB_vsm22EPK5D1y2BQ5k6s5xAvbI=s96-c',
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('puzzle-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('puzzle-user');
    }
  }, []);

  const signIn = useCallback(() => {
    // Simulate signing in
    localStorage.setItem('puzzle-user', JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  }, []);

  const signOut = useCallback(() => {
    // Simulate signing out
    localStorage.removeItem('puzzle-user');
    setUser(null);
  }, []);

  return { user, signIn, signOut };
};
