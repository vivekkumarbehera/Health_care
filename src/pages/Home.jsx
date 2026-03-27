import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1000px', marginTop: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--success))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to HealthConnect
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          A professional, secure, and intuitive platform for monitoring patient vitals, managing health records, and receiving real-time automated alerts. Designed for Care Managers, Parents, and Patients.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
          <Link to="/login" className="btn" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Sign In
          </Link>
          <Link to="/login" state={{ isRegister: true }} className="btn-logout" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', background: 'white' }}>
            Register Now
          </Link>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '4rem' }}>
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <Activity size={48} className="text-primary" style={{ marginBottom: '1.5rem' }} />
          <h3>Real-Time Vitals</h3>
          <p className="text-muted">Track heart rate, oxygen levels, and blood pressure with instant updates and historical logs.</p>
        </div>
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <ShieldCheck size={48} className="text-success" style={{ marginBottom: '1.5rem' }} />
          <h3>Smart Alerts</h3>
          <p className="text-muted">Automated intelligent alerts highlight critical health conditions immediately, ensuring rapid response.</p>
        </div>
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <Users size={48} className="text-warning" style={{ marginBottom: '1.5rem' }} />
          <h3>Role-Based Access</h3>
          <p className="text-muted">Secure customized dashboards for Care Managers, Parents, and Patients to provide exactly what's needed.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
