// components/Layout/ProtectedRoute.jsx - CORRECTED VERSION
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();

  console.log('ProtectedRoute check:', { user: !!user, token: !!token });

  // Check if user is authenticated
  if (!user || !token) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
