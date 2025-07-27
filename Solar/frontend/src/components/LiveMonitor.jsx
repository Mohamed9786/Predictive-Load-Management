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

export default function LiveMonitor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/live-sensor-data');
      const enriched = res.data.map(d => ({
        ...d,
        power: (parseFloat(d.voltage) * parseFloat(d.current)).toFixed(2),
        timestamp: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setData(enriched);
      setError(null);
    } catch (err) {
      console.error("Error fetching live data:", err);
      setError("Failed to load live data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    voltage: "#3b82f6",      // blue
    current: "#10b981",      // green
    power: "#f59e0b",        // amber
    temperature: "#ef4444"   // red
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

          {/* Update Indicator */}
          <div className={`mt-auto text-xs text-green-200/80 ${
            sidebarCollapsed ? 'text-center' : 'text-right'
          }`}>
            Updated every 5s
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📡 Live Sensor Monitor</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading initial data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {["voltage", "current", "power", "temperature"].map((metric) => (
              <div key={metric} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold capitalize mb-3">
                  {metric} ({metric === 'voltage' ? 'V' : 
                   metric === 'current' ? 'A' : 
                   metric === 'power' ? 'W' : '°C'})
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: metric === 'voltage' ? 'Volts (V)' : 
                                 metric === 'current' ? 'Amps (A)' : 
                                 metric === 'power' ? 'Watts (W)' : '°C',
                          angle: -90,
                          position: 'insideLeft'
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} ${metric === 'voltage' ? 'V' : 
                          metric === 'current' ? 'A' : 
                          metric === 'power' ? 'W' : '°C'}`, metric]}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey={metric}
                        stroke={colors[metric]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
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