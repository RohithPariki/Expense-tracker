// context/AuthContext.js - CORRECTED VERSION
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  const login = (userData) => {
    console.log('Login called with:', userData);
    
    // Handle different response structures
    let userInfo, userToken;
    
    if (userData.token) {
      userToken = userData.token;
      userInfo = { ...userData };
      delete userInfo.token;
    } else if (userData.data && userData.data.token) {
      userToken = userData.data.token;
      userInfo = userData.data;
      delete userInfo.token;
    } else {
      console.error('Invalid user data structure:', userData);
      return;
    }

    setUser(userInfo);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Initialize token and user from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout(); // Clear invalid data
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
