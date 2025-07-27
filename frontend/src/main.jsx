import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // make sure this file exists!
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Forecast from './components/ForecastChart';       // Make sure this file exists
import LiveMonitor from './components/LiveMonitor'; // Make sure this file exists

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/live" element={<LiveMonitor />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
