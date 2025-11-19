import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<'user' | 'influencer' | 'admin'>;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="인증 확인 중..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role-based access
  if (roles && user && !roles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ requiredRoles: roles, userRole: user.role }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
