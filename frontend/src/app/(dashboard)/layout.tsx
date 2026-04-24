'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

import { useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, initializeAuth } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading your account..." />;
  }

  if (!isAuthenticated) return null;

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-mesh flex">
      {/* Sidebar — desktop only */}
      <div 
        className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 border-r border-[var(--border-subtle)] ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <Sidebar 
          userName={fullName} 
          userEmail={user?.username} 
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile navbar */}
        <Navbar userName={fullName} userEmail={user?.username} />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
