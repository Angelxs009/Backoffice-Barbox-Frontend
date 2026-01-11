import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './BackofficeLayout.css';

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="backoffice-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main wrapper */}
      <div className="main-wrapper">
        {/* Navbar */}
        <Navbar onMenuToggle={handleToggleSidebar} />

        {/* Main content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout;
