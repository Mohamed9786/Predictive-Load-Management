import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.jpg'; // Make sure logo1.jpg exists in src/assets/

export default function Forecast() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/forecast-5days');
        const formatted = res.data.map(d => ({
          timestamp: new Date(d.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          predicted_power: parseFloat(d.predicted_power).toFixed(2),
          predicted_voltage: parseFloat(d.predicted_voltage).toFixed(2),
          predicted_current: parseFloat(d.predicted_current).toFixed(2),
          predicted_temperature: parseFloat(d.predicted_temperature).toFixed(2)
        }));
        setForecast(formatted);
        setError(null);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setError("Failed to load forecast data");
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  const colors = {
    predicted_power: "#f59e0b",  // amber
    predicted_voltage: "#3b82f6", // blue
    predicted_current: "#10b981", // green
    predicted_temperature: "#ef4444" // red
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Enhanced Sidebar with Logo */}
      <div 
        className={`h-full bg-gradient-to-b from-green-800 to-green-700 text-white transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Logo and Title */}
          <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <img 
              src={logo} 
              alt="TN Power Vision Logo" 
              className={`w-10 h-10 object-cover ${sidebarCollapsed ? 'rounded-full' : 'rounded-lg'} border-2 border-white`}
            />
            <h2 className={`text-xl font-bold ml-3 whitespace-nowrap transition-opacity ${
              sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}>
              TN Power Vision
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link 
              to="/" 
              className="flex items-center hover:bg-green-600/30 rounded-lg p-2 transition-colors"
              title="Dashboard"
            >
              <span className="text-xl min-w-[24px]">📊</span>
              <span className={`ml-3 whitespace-nowrap ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}>
                Dashboard
              </span>
            </Link>
            <Link 
              to="/forecast" 
              className="flex items-center hover:bg-green-600/30 rounded-lg p-2 transition-colors"
              title="Forecast"
            >
              <span className="text-xl min-w-[24px]">🔆</span>
              <span className={`ml-3 whitespace-nowrap ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}>
                Forecast
              </span>
            </Link>
            <Link 
              to="/live" 
              className="flex items-center hover:bg-green-600/30 rounded-lg p-2 transition-colors"
              title="Live Monitor"
            >
              <span className="text-xl min-w-[24px]">📡</span>
              <span className={`ml-3 whitespace-nowrap ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}>
                Live Monitor
              </span>
            </Link>
          </nav>

          {/* Version Info */}
          <div className={`mt-auto text-xs text-green-200/80 ${
            sidebarCollapsed ? 'text-center' : 'text-right'
          }`}>
            v1.0.0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔮 5-Day Forecast</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading forecast data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {["predicted_power", "predicted_voltage", "predicted_current", "predicted_temperature"].map((key) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold capitalize mb-3">
                  {key.replace("predicted_", "").replace("_", " ")} Forecast
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({key.includes('power') ? 'kW' : 
                      key.includes('voltage') ? 'V' : 
                      key.includes('current') ? 'A' : '°C'})
                  </span>
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Date & Time', position: 'insideBottomRight', offset: -5 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: key.includes('power') ? 'Power (kW)' : 
                                 key.includes('voltage') ? 'Voltage (V)' : 
                                 key.includes('current') ? 'Current (A)' : 'Temperature (°C)',
                          angle: -90,
                          position: 'insideLeft'
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} ${key.includes('power') ? 'kW' : 
                          key.includes('voltage') ? 'V' : 
                          key.includes('current') ? 'A' : '°C'}`, key.replace("predicted_", "")]}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey={key}
                        stroke={colors[key]}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}