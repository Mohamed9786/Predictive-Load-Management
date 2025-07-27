import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.jpg'; // Make sure this file exists

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    axios.get('/predict-today')
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Error fetching data:", err);
        setError("Failed to load prediction data");
      });
  }, []);

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
          {/* Logo & Title */}
          <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <img src={logo} alt="Logo" className="w-10 h-10 object-cover border-2 border-white rounded-full" />
            <h2
              className={`text-xl font-bold ml-3 whitespace-nowrap transition-opacity ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              TN Power Vision
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/"
              className="flex items-center hover:bg-green-700/50 rounded-lg p-2 transition-colors"
              title="Dashboard"
            >
              <span className="text-xl">📊</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Dashboard</span>
            </Link>
            <Link
              to="/forecast"
              className="flex items-center hover:bg-green-700/50 rounded-lg p-2 transition-colors"
              title="Forecast"
            >
              <span className="text-xl">🔆</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Forecast</span>
            </Link>
            <Link
              to="http://localhost:5173"
              className="flex items-center hover:bg-green-700/50 rounded-lg p-2 transition-colors"
              title="Solar Monitor"
            >
              <span className="text-xl">📡</span>
              <span className={`ml-3 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Solar Monitor</span>
            </Link>
          </nav>

          <div className={`mt-auto text-xs text-green-200/80 ${sidebarCollapsed ? 'text-center' : 'text-right'}`}>
            v1.0.0
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🔮 Today's Prediction</h1>

        {error && (
          <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-4 mb-4">
            {error}
          </div>
        )}

        {!data ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* Usage */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-700">⚡ Predicted Usage</h2>
              <p className="text-2xl text-green-700">{data.predicted_usage.toFixed(2)} MW</p>
              <p className="text-sm text-gray-500 mt-1">📅 Holiday: {data.is_holiday ? 'Yes' : 'No'}</p>
            </div>

            {/* Production Mix */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-700">🔧 Production Mix</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-gray-800">
                {Object.entries(data.production_mix).map(([key, value]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toFixed(2)} MW
                  </li>
                ))}
              </ul>
            </div>

            {/* Weather */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-700">🌤️ Weather</h2>
              <p>🌡️ Temperature: {data.weather.temp} °C</p>
              <p>💧 Humidity: {data.weather.humidity} %</p>
              <p>🌬️ Wind Speed: {data.weather.wind_speed} m/s</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
