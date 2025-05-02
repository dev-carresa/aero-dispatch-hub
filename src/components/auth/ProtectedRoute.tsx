
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthenticationCheck } from './AuthenticationCheck';
import { AuthRedirect } from './AuthRedirect';

export const ProtectedRoute: React.FC = () => {
  return (
    <AuthenticationCheck>
      <AuthRedirect>
        <Outlet />
      </AuthRedirect>
    </AuthenticationCheck>
  );
};
