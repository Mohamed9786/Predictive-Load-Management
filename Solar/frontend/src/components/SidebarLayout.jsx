import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">⚡ TN Power Vision</h2>
        <nav className="space-y-4 text-lg">
          <Link to="/" className="block hover:text-blue-300">📊 Dashboard</Link>
          <Link to="/forecast" className="block hover:text-blue-300">🔆 Forecast</Link>
          <Link to="/live" className="block hover:text-blue-300">📡Solar Monitor</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
