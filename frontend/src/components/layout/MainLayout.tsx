import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`flex min-h-screen ${isHomePage ? 'bg-[#000000]' : 'bg-[#eee]'} overflow-hidden`}>
      <Sidebar />
      
      <main className="flex-1 w-full p-4 transition-all duration-300 md:ml-64 overflow-auto">
        <div className="container mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;