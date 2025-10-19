import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import Sidebar from './Sidebar.jsx';
import HeaderBar from './HeaderBar.jsx';
import RoleDetails from './RoleDetails.jsx';

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  accent: '#FAC1D9',
  text: '#FFFFFF',
  muted: '#777979',
};

export default function Layout({ children, title, showBackButton = false, right = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>
        <div style={{
          color: colors.accent,
          fontSize: 18,
          fontWeight: 500
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text }}>
      <div style={{ width: 1440, margin: '0 auto', position: 'relative' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <HeaderBar 
          title={title} 
          showBackButton={showBackButton} 
          right={right ? (
            <>
              <RoleDetails />
              {right}
            </>
          ) : (
            <RoleDetails />
          )}
        />

        {/* Content */}
        <main style={{ paddingLeft: 208, paddingRight: 32, paddingTop: 100, paddingBottom: 32 }}>
          {children}
        </main>

      </div>
    </div>
  );
}
