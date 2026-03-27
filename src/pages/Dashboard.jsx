import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Wind, HeartPulse, AlertTriangle, MessageSquarePlus, Clock, ShieldAlert } from 'lucide-react';

// Helper: determine severity of each vital based on the backend alert rules
const getVitalStatus = (type, value) => {
  if (type === 'heartRate') {
    if (value < 50 || value > 110) return { label: 'Alert', color: '#ef4444' };
    return { label: 'Normal', color: 'var(--success)' };
  }
  if (type === 'oxygenLevel') {
    if (value < 92) return { label: 'Critical', color: '#dc2626' };
    return { label: 'Normal', color: 'var(--success)' };
  }
  if (type === 'bloodPressure' && value) {
    const [sys, dia] = value.toString().split('/').map(Number);
    if (!isNaN(sys) && !isNaN(dia) && (sys > 140 || dia > 90))
      return { label: 'Warning', color: '#f59e0b' };
    return { label: 'Normal', color: 'var(--success)' };
  }
  return { label: 'Normal', color: 'var(--success)' };
};

const VitalCard = ({ icon: Icon, iconColor, label, value, unit, statusType }) => {
  const status = value != null ? getVitalStatus(statusType, value) : null;
  return (
    <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        <Icon color={iconColor} size={20} />
        {label}
      </div>
      <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: value != null ? status.color : 'var(--text-muted)' }}>
        {value ?? '--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{unit}</span>
      </p>
      {status && (
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem',
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
          background: status.color + '22', color: status.color, border: `1px solid ${status.color}55`
        }}>
          {status.label}
        </span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [observations, setObservations] = useState([]);
  const [newObservation, setNewObservation] = useState('');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

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
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        // Auto-seed default vitals (only runs if user has no data yet)
        await api.post('/api/health/seed');
        await fetchData();
      } catch (err) {
        console.error('Failed to initialize dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await api.post('/api/health/random');
      await fetchData();
    } catch (err) {
      alert('Failed to simulate new vitals');
    } finally {
      setSimulating(false);
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Overview
        </h1>
        <button 
          onClick={handleSimulate} 
          className="btn" 
          disabled={simulating}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.6rem 1.2rem',
            background: simulating ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), var(--success))'
          }}
        >
          <Activity size={18} className={simulating ? 'animate-spin' : ''} />
          {simulating ? 'Simulating...' : 'Simulate New Vital'}
        </button>
      </div>


      {/* Vitals Row */}
      <div className="grid">
        <VitalCard
          icon={Activity} iconColor="#ef4444"
          label="Heart Rate" unit="BPM"
          value={healthData?.heartRate ?? null}
          statusType="heartRate"
        />
        <VitalCard
          icon={Wind} iconColor="#6366f1"
          label="Oxygen Level" unit="%"
          value={healthData?.oxygenLevel ?? null}
          statusType="oxygenLevel"
        />
        <VitalCard
          icon={HeartPulse} iconColor="#f59e0b"
          label="Blood Pressure" unit="mmHg"
          value={healthData?.bloodPressure ?? null}
          statusType="bloodPressure"
        />
      </div>

      <div className="grid" style={{ marginTop: '2rem' }}>
        {/* Alerts */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <ShieldAlert className="text-danger" size={20} />
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
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No recent alerts.</p>
            )}
          </div>
        </div>

        {/* Observations */}
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
                        {new Date(obs.createdAt).toLocaleString()}
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
