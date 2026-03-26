import React, { useState } from 'react';
import api from '../services/api';

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
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Add Health Data</h2>
        {message && <p className={message.includes('success') ? 'alert-green' : 'alert-red'}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Heart Rate (BPM)</label>
            <input 
              type="number" 
              required 
              value={formData.heartRate}
              onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Oxygen Level (%)</label>
            <input 
              type="number" 
              required 
              value={formData.oxygenLevel}
              onChange={(e) => setFormData({...formData, oxygenLevel: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Blood Pressure (mmHg)</label>
            <input 
              type="text" 
              placeholder="e.g. 120/80"
              required 
              value={formData.bloodPressure}
              onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Health Data'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHealthData;
