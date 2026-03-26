import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient health data (using a placeholder ID or current user)
        const healthRes = await api.get('/api/patient/current');
        setHealthData(healthRes.data);
        
        // Fetch recent alerts
        const alertsRes = await api.get('/api/alerts');
        setAlerts(alertsRes.data.slice(0, 5)); // Show top 5
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container">Loading Dashboard...</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      <div className="grid">
        <div className="card">
          <h3>Heart Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{healthData?.heartRate || '--'} BPM</p>
        </div>
        <div className="card">
          <h3>Oxygen Level</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{healthData?.oxygenLevel || '--'}%</p>
        </div>
        <div className="card">
          <h3>Blood Pressure</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{healthData?.bloodPressure || '--'} mmHg</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Recent Alerts</h3>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className={`card alert-${alert.severity.toLowerCase()}`}>
              <strong>{alert.message}</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No recent alerts.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
