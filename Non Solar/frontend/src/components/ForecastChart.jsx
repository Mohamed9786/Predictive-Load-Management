import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import SidebarLayout from '../components/SidebarLayout'; // adjust the path as needed

export default function Forecast() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/forecast-14day')
      .then(res => {
        const formatted = res.data.map(d => ({
          ...d,
          date: new Date(d.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
          })
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Forecast API Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <SidebarLayout>
      <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">🔮 14-Day Power Forecast (All Sources)</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="hydro" stroke="#0ea5e9" name="Hydro" />
              <Line type="monotone" dataKey="solar" stroke="#facc15" name="Solar" />
              <Line type="monotone" dataKey="thermal" stroke="#f87171" name="Thermal" />
              <Line type="monotone" dataKey="wind" stroke="#34d399" name="Wind" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </SidebarLayout>
  );
} 