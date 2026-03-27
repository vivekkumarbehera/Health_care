import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LayoutDashboard, Bell, FilePlus, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : '';
  };

  return (
    <nav className="navbar animate-fade-in" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <h2>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} />
          HealthConnect
        </Link>
      </h2>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" style={location.pathname === '/dashboard' ? {color: 'var(--primary)', fontWeight: 600} : {}}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/alerts" style={location.pathname === '/alerts' ? {color: 'var(--primary)', fontWeight: 600} : {}}>
              <Bell size={18} />
              Alerts
            </Link>
            {user.role === 'Care Manager' && (
              <Link to="/add-data" style={location.pathname === '/add-data' ? {color: 'var(--primary)', fontWeight: 600} : {}}>
                <FilePlus size={18} />
                Add Data
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--card-border)' }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                <User size={16} />
                {user.role}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-logout" style={{ background: 'transparent' }}>Sign In</Link>
            <Link to="/login" state={{ isRegister: true }} className="btn" style={{ color: 'white' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
