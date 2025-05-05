
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLayout } from './LayoutContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { layoutSettings } = useLayout();

  return (
    <div className={cn(
      "flex h-screen overflow-hidden",
      layoutSettings.compactSidebar && "compact-sidebar"
    )}>
      <Sidebar />
      <div className={cn(
        "flex flex-col flex-1 overflow-hidden",
        layoutSettings.fixedHeader && "fixed-header-container"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
