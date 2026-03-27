import React, { useState } from 'react';
import api from '../services/api';
import { HeartPulse, Droplets, Activity, FilePlus } from 'lucide-react';

const AddHealthData = () => {
  const [formData, setFormData] = useState({
    heartRate: '',
    oxygenLevel: '',
    bloodPressure: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/api/health', formData);
      setMessage('Health data submitted successfully!');
      setFormData({ heartRate: '', oxygenLevel: '', bloodPressure: '' });
    } catch (err) {
      setMessage('Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container centered-view animate-fade-in">
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <FilePlus className="text-primary" size={28} />
          Record Vitals
        </h2>
        {message && (
          <div className={`alert-box ${message.includes('success') ? 'alert-green' : 'alert-red'}`} style={{ marginBottom: '1.5rem' }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} className="text-danger" />
              Heart Rate (BPM)
            </label>
            <input 
              type="number" 
              required 
              placeholder="e.g. 72"
              value={formData.heartRate}
              onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={16} className="text-primary" />
              Oxygen Level (%)
            </label>
            <input 
              type="number" 
              required 
              placeholder="e.g. 98"
              value={formData.oxygenLevel}
              onChange={(e) => setFormData({...formData, oxygenLevel: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HeartPulse size={16} className="text-warning" />
              Blood Pressure (mmHg)
            </label>
            <input 
              type="text" 
              placeholder="e.g. 120/80"
              required 
              value={formData.bloodPressure}
              onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
            />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            {loading ? 'Submitting...' : 'Log Health Data'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHealthData;
