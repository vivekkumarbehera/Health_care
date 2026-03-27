import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(location.state?.isRegister || false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Parent'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.isRegister !== undefined) {
      setIsRegister(location.state.isRegister);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const res = await api.post(endpoint, formData);
      if (!isRegister) {
        login(res.data.token, res.data.role);
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please login.');
        setIsRegister(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="container centered-view">
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          {isRegister ? <><UserPlus className="text-primary" /> Register</> : <><LogIn className="text-primary" /> Login</>}
        </h2>
        {error && <div className="alert-red alert-box" style={{ padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Select Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Care Manager">Care Manager</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              {isRegister ? 'Sign In' : 'Register now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
