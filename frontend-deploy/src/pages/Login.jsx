import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useUser } from './UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useUser();

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('...');
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      updateUser(res.user);
      setMsg('Logged in as ' + res.user.role);
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (e) {
      setMsg(e.message || 'Error');
    }
  }

  // Quick login for testing purposes
  async function quickLogin(role) {
    setMsg('Logging in as ' + role + '...');
    try {
      let credentials;
      
      // Set credentials based on role
      switch(role) {
        case 'ADMIN':
          credentials = { email: 'admin@cosypos.app', password: 'pass123' };
          break;
        case 'STAFF':
          credentials = { email: 'staff@cosypos.app', password: 'staff123' };
          break;
        case 'USER':
          credentials = { email: 'customer@cosypos.app', password: 'customer123' };
          break;
        default:
          throw new Error('Invalid role');
      }
      
      // Fill the form fields
      setEmail(credentials.email);
      setPassword(credentials.password);
      
      // Perform actual login
      const res = await login(credentials.email, credentials.password);
      localStorage.setItem('token', res.token);
      updateUser(res.user);
      setMsg('Logged in as ' + res.user.role);
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (e) {
      setMsg('Error logging in as ' + role + ': ' + (e.message || 'Invalid credentials'));
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 24 }}>
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center', fontWeight: 700, color: '#FAC1D9', fontSize: 28 }}>COSYPOS</div>
      <div style={{ width: '100%', maxWidth: 640, background: '#292C2D', borderRadius: 32, color: '#fff', padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ textAlign: 'center', fontWeight: 500, fontSize: 40, marginTop: 8 }}>Login!</div>
        <div style={{ textAlign: 'center', marginTop: 8, opacity: .9 }}>Please enter your credentials below to continue</div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <div style={{ marginTop: 28 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Username</div>
            <input placeholder="Enter your username" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: '#3D4142', color: '#fff' }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Password</div>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: '#3D4142', color: '#fff' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FAC1D9' }}>
              <input type="checkbox" style={{ accentColor: '#FAC1D9' }} /> Remember me
            </label>
            <Link to="/forgot" style={{ color: '#FAC1D9', textDecoration: 'underline' }}>Forgot Password?</Link>
          </div>
          <button style={{ marginTop: 16, alignSelf: 'center', padding: '16px 42px', borderRadius: 10, background: '#FAC1D9', border: 'none', color: '#333', fontWeight: 600 }}>Login</button>
        </form>
        
        {/* Quick Login Buttons for Testing */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #3D4142' }}>
          <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, opacity: 0.8 }}>
            Quick Login for Testing
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              onClick={() => quickLogin('ADMIN')}
              style={{ 
                padding: '12px 20px', 
                borderRadius: 8, 
                background: '#FAC1D9', 
                border: 'none', 
                color: '#333', 
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#E8A8C8'}
              onMouseLeave={(e) => e.target.style.background = '#FAC1D9'}
            >
              ADMIN
            </button>
            <button 
              onClick={() => quickLogin('STAFF')}
              style={{ 
                padding: '12px 20px', 
                borderRadius: 8, 
                background: '#4CAF50', 
                border: 'none', 
                color: '#fff', 
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#45a049'}
              onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
            >
              STAFF
            </button>
            <button 
              onClick={() => quickLogin('USER')}
              style={{ 
                padding: '12px 20px', 
                borderRadius: 8, 
                background: '#2196F3', 
                border: 'none', 
                color: '#fff', 
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1976D2'}
              onMouseLeave={(e) => e.target.style.background = '#2196F3'}
            >
              USER
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: 16, fontSize: 12, opacity: .85 }}>{msg}</div>
      </div>
    </div>
  );
}


