
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRolePermission } from '@/hooks/useRolePermission';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { userRole } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="container mx-auto max-w-7xl">
            {/* Show role indicator for development */}
            {userRole && (
              <div className="mb-4 p-2 text-sm bg-white shadow rounded">
                <span className="font-bold">Current Role:</span> {userRole}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
