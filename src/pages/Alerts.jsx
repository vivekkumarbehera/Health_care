import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/api/alerts');
        setAlerts(res.data);
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="container">Loading Alerts...</div>;

  return (
    <div className="container">
      <h1>Health Alerts</h1>
      <div className="card">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className={`card alert-${alert.severity.toLowerCase()}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{alert.message}</strong>
                <span className="badge">{alert.severity}</span>
              </div>
              <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No health alerts currently.</p>
        )}
      </div>
    </div>
  );
};

export default Alerts;
