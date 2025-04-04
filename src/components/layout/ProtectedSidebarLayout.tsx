
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import SidebarLayout from './SidebarLayout';
import Loading from '@/components/Loading';

interface ProtectedSidebarLayoutProps {
  children: ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { user, loading } = useUser();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <Loading message="Checking authentication..." />;
  }
  
  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Show the sidebar layout with the children
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default ProtectedSidebarLayout;
