import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, AlertCircle, Clock } from 'lucide-react';

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

  if (loading) return (
    <div className="container centered-view">
      <div className="animate-fade-in text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
        <Bell className="text-primary" size={24} style={{ animation: 'pulse 2s infinite' }} />
        Loading Alerts...
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Bell className="text-primary" size={28} />
        System Alerts
      </h1>
      
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        {alerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-box alert-${alert.severity.toLowerCase()}`} style={{ animationDelay: `${index * 0.1}s`, margin: 0 }}>
                <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{alert.message}</strong>
                  </div>
                  <p style={{ margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <span style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem' }}>All clear. No health alerts currently.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
