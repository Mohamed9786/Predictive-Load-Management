// src/components/SidebarLayout.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.jpg';

export default function SidebarLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`h-full bg-gradient-to-b from-green-800 to-green-900 text-white transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Logo and Title */}
          <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <img src={logo} alt="Logo" className="w-10 h-10 object-cover border-2 border-white rounded-full" />
            <h2 className={`text-xl font-bold ml-3 whitespace-nowrap transition-opacity ${
              sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}>
              TN Power Vision
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <Link to="/" className="flex items-center hover:bg-green-700/50 rounded-lg p-2">
              <span className="text-xl">📊</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Dashboard</span>
            </Link>
            <Link to="/forecast" className="flex items-center hover:bg-green-700/50 rounded-lg p-2">
              <span className="text-xl">🔆</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Forecast</span>
            </Link>
            <Link to="http://localhost:5173" className="flex items-center hover:bg-green-700/50 rounded-lg p-2">
              <span className="text-xl">📡</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Solar Monitor</span>
            </Link>
          </nav>

          <div className={`mt-auto text-xs text-green-200/80 ${sidebarCollapsed ? 'text-center' : 'text-right'}`}>
            v1.0.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
