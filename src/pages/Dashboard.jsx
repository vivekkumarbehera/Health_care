import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Wind, HeartPulse, AlertTriangle, MessageSquarePlus, Clock } from 'lucide-react';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [observations, setObservations] = useState([]);
  const [newObservation, setNewObservation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await api.get('/api/patient/current');
        setHealthData(healthRes.data);
        
        const alertsRes = await api.get('/api/alerts');
        setAlerts(alertsRes.data.slice(0, 5));

        const obsRes = await api.get('/api/observations');
        setObservations(obsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddObservation = async (e) => {
    e.preventDefault();
    if (!newObservation) return;
    try {
      const res = await api.post('/api/observations', { note: newObservation });
      setObservations([res.data.observation, ...observations]);
      setNewObservation('');
    } catch (err) {
      alert('Failed to add observation');
    }
  };

  if (loading) return (
    <div className="container centered-view">
      <div className="animate-fade-in text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
        <Activity className="text-primary" size={24} style={{ animation: 'pulse 2s infinite' }} />
        Loading Dashboard...
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        Overview
      </h1>
      
      <div className="grid">
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Activity className="text-danger" size={20} />
            Heart Rate
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>
            {healthData?.heartRate || '--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>BPM</span>
          </p>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Wind className="text-primary" size={20} />
            Oxygen Level
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>
            {healthData?.oxygenLevel || '--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </p>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <HeartPulse className="text-warning" size={20} />
            Blood Pressure
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>
            {healthData?.bloodPressure || '--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>mmHg</span>
          </p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '2rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertTriangle className="text-danger" size={20} />
            Recent Alerts
          </h3>
          <div className="card glass-panel">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className={`alert-box alert-${alert.severity.toLowerCase()}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{alert.message}</strong>
                    <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No recent alerts.</p>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MessageSquarePlus className="text-primary" size={20} />
            Patient Observations
          </h3>
          <div className="card glass-panel">
            <form onSubmit={handleAddObservation} style={{ marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Share a thought or observation..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.5)' }}
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Add Observation</button>
            </form>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {observations.length > 0 ? (
                observations.map((obs, index) => (
                  <div key={index} style={{ borderLeft: '3px solid var(--primary)', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '0 0.5rem 0.5rem 0' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{obs.note}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(obs.timestamp).toLocaleString()}
                      </span>
                      {obs.user?.role && <span style={{ background: 'var(--bg-gradient-end)', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>{obs.user.role}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>No observations yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
