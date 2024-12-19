import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from '@/admin/console/TopNav';
import { AdminConsole } from '@/admin/console/AdminConsole';

export function Layout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <TopNav />

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}