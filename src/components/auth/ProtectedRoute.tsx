
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If still loading, return nothing or a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to the home page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the children
  return <Outlet />;
};

export default ProtectedRoute;
