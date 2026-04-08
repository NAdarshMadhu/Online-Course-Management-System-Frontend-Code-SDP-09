import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/dummyData';

const STORAGE_KEY = 'ocms_auth';

const AuthContext = createContext(null);

function loadAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, isAuthenticated: parsed.isAuthenticated };
    }
  } catch (e) { /* ignore */ }
  return { user: null, isAuthenticated: false };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuth().user);
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadAuth().isAuthenticated);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isAuthenticated }));
  }, [user, isAuthenticated]);

  const login = (userData) => {
  const emailName = userData.email.split('@')[0];

  const displayName = emailName
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  setUser({
    ...userData,
    name: displayName,
  });

  setIsAuthenticated(true);
  return true;
};

  const signup = (name, email, password, role) => {
    const userData = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      role,
      avatar: null,
      joinedAt: new Date().toISOString().split('T')[0],
      ...(role === 'student' ? { enrolledCourses: [] } : { designation: 'Educator' }),
    };
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
