import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Overlay to close sidebar on mobile when clicked */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
