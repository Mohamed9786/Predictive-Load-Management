import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.jpg';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [extremes, setExtremes] = useState({
    maxPower: null, minPower: null,
    maxCurrent: null, minCurrent: null,
    maxVoltage: null, minVoltage: null,
    maxTemp: null, minTemp: null,
    live: null, loading: true, error: null
  });

  const fetchExtremes = async () => {
    try {
      setExtremes(prev => ({ ...prev, loading: true, error: null }));

      const [powerRes, currentRes, voltTempRes, liveRes] = await Promise.all([
        axios.get('/forecast-extremes'),
        axios.get('/current-extremes'),
        axios.get('/forecast-extremes-full'),
        axios.get('/live-extremes'),
      ]);

      setExtremes({
  maxPower: powerRes.data.max_predicted_power,
  minPower: powerRes.data.min_predicted_power,
  maxCurrent: currentRes.data.max_current,
  minCurrent: currentRes.data.min_current,
  maxVoltage: voltTempRes.data.voltage?.max,
  minVoltage: voltTempRes.data.voltage?.min,
  maxTemp: voltTempRes.data.temperature?.max,
  minTemp: voltTempRes.data.temperature?.min,
  live: liveRes.data,
  loading: false,
  error: null
});

    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setExtremes(prev => ({ ...prev, loading: false, error: "Failed to load data. Try again." }));
    }
  };

  useEffect(() => {
    fetchExtremes();
    const interval = setInterval(fetchExtremes, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`h-full bg-gradient-to-b from-green-800 to-green-900 text-white transition-all ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="p-4 flex flex-col h-full">
          <div className={`flex items-center mb-6 ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
            {!sidebarCollapsed && <h2 className="ml-3 text-xl font-bold">TN Power Vision</h2>}
          </div>
          <nav className="space-y-2">
            <Link to="/" className="flex items-center p-3 hover:bg-green-700/50 rounded-lg">
              <span>📊</span>
              {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
            </Link>
            <Link to="/forecast" className="flex items-center p-3 hover:bg-green-700/50 rounded-lg">
              <span>🔆</span>
              {!sidebarCollapsed && <span className="ml-3">Forecast</span>}
            </Link>
            <Link to="/live" className="flex items-center p-3 hover:bg-green-700/50 rounded-lg">
              <span>📡</span>
              {!sidebarCollapsed && <span className="ml-3">Live Monitor</span>}
            </Link>
            <button
              onClick={() => window.location.href = 'http://localhost:3001'}
              className="flex items-center p-3 hover:bg-green-700/50 rounded-lg w-full"
            >
              <span>⚡</span>
              {!sidebarCollapsed && <span className="ml-3">Non-Solar</span>}
            </button>
          </nav>
          <div className={`mt-auto text-xs text-green-300 ${sidebarCollapsed ? 'text-center' : 'text-right'}`}>v1.0.0</div>
        </div>
      </div>

      {/* Main Panel */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📈 Solar Forecast & Live Insights</h1>

        {extremes.error && (
          <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-4 mb-4">
            {extremes.error}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-2">🔮 Forecasted Extremes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InfoCard label="🔺 Max Power" value={extremes.maxPower?.value} unit="W" color="green" time={extremes.maxPower?.timestamp} />
          <InfoCard label="🔻 Min Power" value={extremes.minPower?.value} unit="W" color="red" time={extremes.minPower?.timestamp} />
          <InfoCard label="🔺 Max Current" value={extremes.maxCurrent?.value} unit="A" color="blue" time={extremes.maxCurrent?.timestamp} />
          <InfoCard label="🔻 Min Current" value={extremes.minCurrent?.value} unit="A" color="yellow" time={extremes.minCurrent?.timestamp} />
          <InfoCard label="🔺 Max Voltage" value={extremes.maxVoltage?.value} unit="V" color="blue" time={extremes.maxVoltage?.timestamp} />
          <InfoCard label="🔻 Min Voltage" value={extremes.minVoltage?.value} unit="V" color="yellow" time={extremes.minVoltage?.timestamp} />
          <InfoCard label="🌡️ Max Temp" value={extremes.maxTemp?.value} unit="°C" color="red" time={extremes.maxTemp?.timestamp} />
          <InfoCard label="🌡️ Min Temp" value={extremes.minTemp?.value} unit="°C" color="blue" time={extremes.minTemp?.timestamp} />
        </div>

        <h2 className="text-xl font-semibold mb-2">📡 Live ESP32 Sensor Extremes</h2>
        {extremes.live ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard label="⚡ Max Power (Live)" value={extremes.live.power?.max?.value} unit="W" color="green" time={extremes.live.power?.max?.timestamp} />
            <InfoCard label="⚡ Min Power (Live)" value={extremes.live.power?.min?.value} unit="W" color="red" time={extremes.live.power?.min?.timestamp} />
            <InfoCard label="🔺 Max Voltage (Live)" value={extremes.live.voltage?.max?.value} unit="V" color="blue" time={extremes.live.voltage?.max?.timestamp} />
            <InfoCard label="🔻 Min Voltage (Live)" value={extremes.live.voltage?.min?.value} unit="V" color="yellow" time={extremes.live.voltage?.min?.timestamp} />
            <InfoCard label="🔺 Max Current (Live)" value={extremes.live.current?.max?.value} unit="A" color="blue" time={extremes.live.current?.max?.timestamp} />
            <InfoCard label="🔻 Min Current (Live)" value={extremes.live.current?.min?.value} unit="A" color="yellow" time={extremes.live.current?.min?.timestamp} />
            <InfoCard label="🌡️ Max Temp (Live)" value={extremes.live.temperature?.max?.value} unit="°C" color="red" time={extremes.live.temperature?.max?.timestamp} />
            <InfoCard label="🌡️ Min Temp (Live)" value={extremes.live.temperature?.min?.value} unit="°C" color="blue" time={extremes.live.temperature?.min?.timestamp} />
          </div>
        ) : (
          <p className="text-gray-600">📡 No live data available</p>
        )}
      </main>
    </div>
  );
}

function InfoCard({ label, value, unit, color = "gray", time }) {
  const formattedValue = typeof value === "number" ? value.toFixed(2) : "N/A";
  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color] || 'text-gray-600'}`}>
        {formattedValue} {unit}
      </p>
      {time && <p className="text-xs text-gray-400 mt-1">{new Date(time).toLocaleString()}</p>}
    </div>
  );
}

const colorMap = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
  yellow: "text-yellow-500",
  gray: "text-gray-600"
};