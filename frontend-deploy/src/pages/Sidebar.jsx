import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { useUser } from './UserContext'

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  accent: '#FAC1D9',
  text: '#FFFFFF',
  muted: '#777979',
}

function NavCard({ to, label, icon: Icon, active }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
      <div style={{ 
        position: 'relative', 
        width: 117, 
        height: 84, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Pink background rectangle - only shows when selected */}
        <div style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          top: 0, 
          bottom: 0, 
          background: active ? colors.accent : 'transparent', 
          borderRadius: 7.42918 
        }} />
        
        {/* White circle with icon - always visible */}
        <div style={{ 
          width: 36, 
          height: 36, 
          background: '#FFFFFF', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 8,
          marginLeft: -3,
          zIndex: 1
        }}>
          <Icon color={colors.accent} />
        </div>
        
        {/* Text */}
        <div style={{ 
          fontFamily: 'Poppins', 
          fontWeight: 400, 
          fontSize: 16, 
          lineHeight: '24px', 
          textAlign: 'center', 
          color: active ? '#333333' : '#FFFFFF',
          zIndex: 1
        }}>
          {label}
        </div>
      </div>
    </Link>
  )
}

function DashboardGridIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1" ry="1" fill={color} />
      <rect x="9" y="1" width="6" height="6" rx="1" ry="1" fill={color} />
      <rect x="1" y="9" width="6" height="6" rx="1" ry="1" fill={color} />
      <rect x="9" y="9" width="6" height="6" rx="1" ry="1" fill={color} />
    </svg>
  )
}

function MenuIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book/Notebook Icon */}
      {/* Spine */}
      <rect x="2" y="2" width="2" height="12" fill={color} />
      {/* Cover */}
      <rect x="4" y="2" width="10" height="12" rx="2" fill={color} />
      {/* Lines on cover */}
      <rect x="5" y="6" width="8" height="1" rx="0.5" fill="#FFFFFF" />
      <rect x="5" y="8" width="8" height="1" rx="0.5" fill="#FFFFFF" />
    </svg>
  )
}

function StaffIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two people silhouettes - one slightly in front of the other */}
      {/* Left Person (behind) */}
      <circle cx="8" cy="6" r="2.5" fill={color} />
      <path d="M5 10 C5 8.5 6 7.5 8 7.5 C10 7.5 11 8.5 11 10 L11 18 C11 19.5 10 20.5 8 20.5 C6 20.5 5 19.5 5 18 Z" fill={color} />
      
      {/* Right Person (in front, overlapping left) */}
      <circle cx="14" cy="5.5" r="2.5" fill={color} />
      <path d="M11 9.5 C11 8 12 7 14 7 C16 7 17 8 17 9.5 L17 18 C17 19.5 16 20.5 14 20.5 C12 20.5 11 19.5 11 18 Z" fill={color} />
    </svg>
  )
}

function InventoryIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3D Box/Package with checkmark */}
      {/* Box top face */}
      <path d="M3 4 L8 2 L13 4 L8 6 Z" fill={color} opacity="0.98" />
      
      {/* Box front face */}
      <path d="M3 4 L3 10 L8 12 L8 6 Z" fill={color} opacity="0.99" />
      
      {/* Box right face */}
      <path d="M13 4 L13 10 L8 12 L8 6 Z" fill={color} opacity="0.98" />
      
      {/* Checkmark circle */}
      <circle cx="11" cy="5" r="2" fill="#FBCCE0" />
      
      {/* Checkmark */}
      <path d="M10 5 L10.5 5.5 L12 4" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReportsIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clipboard with checklist and checkmark */}
      {/* Clipboard body */}
      <rect x="4" y="2" width="8" height="10" rx="1" fill={color} opacity="0.97" />
      
      {/* Clipboard clip */}
      <rect x="5" y="1" width="6" height="2" rx="0.5" fill={color} opacity="0.99" />
      
      {/* Checklist lines */}
      <rect x="5.5" y="4" width="5" height="0.5" rx="0.25" fill={color} />
      <rect x="5.5" y="6" width="5" height="0.5" rx="0.25" fill={color} />
      <rect x="5.5" y="8" width="5" height="0.5" rx="0.25" fill={color} />
      
      {/* Checkmarks on lines */}
      <path d="M5 4 L5.5 4.5 L6.5 3.5" stroke={color} strokeWidth="0.3" fill="none" strokeLinecap="round" />
      <path d="M5 6 L5.5 6.5 L6.5 5.5" stroke={color} strokeWidth="0.3" fill="none" strokeLinecap="round" />
      <path d="M5 8 L5.5 8.5 L6.5 7.5" stroke={color} strokeWidth="0.3" fill="none" strokeLinecap="round" />
      
      {/* Circular checkmark at bottom right */}
      <circle cx="11" cy="10" r="1.5" fill="#FFFFFF" />
      <path d="M10.2 10 L10.7 10.5 L11.8 9.5" stroke={color} strokeWidth="0.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrdersIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tea/Coffee Cup with Steam */}
      {/* Cup body */}
      <path d="M3 4 L3 10 C3 11.5 4.5 13 6 13 L10 13 C11.5 13 13 11.5 13 10 L13 4 Z" fill={color} opacity="0.95" />
      
      {/* Cup handle */}
      <path d="M13 6 C14 6 15 7 15 8 C15 9 14 10 13 10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.97" />
      
      {/* Cup rim */}
      <rect x="3" y="3" width="10" height="1" fill={color} opacity="0.97" />
      
      {/* Steam lines */}
      <path d="M5 2 L5 1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.95" />
      <path d="M7 2 L7 1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.97" />
      <path d="M9 2 L9 1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.97" />
      <path d="M11 2 L11 1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.96" />
      
      {/* Additional steam curves */}
      <path d="M5.5 1.5 Q6 1 6.5 1.5" stroke={color} strokeWidth="0.6" fill="none" opacity="0.96" />
      <path d="M8.5 1.5 Q9 1 9.5 1.5" stroke={color} strokeWidth="0.6" fill="none" opacity="0.95" />
      <path d="M10.5 1.5 Q11 1 11.5 1.5" stroke={color} strokeWidth="0.6" fill="none" opacity="0.94" />
    </svg>
  )
}

function ReservationIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar/Booking Icon */}
      {/* Calendar base */}
      <rect x="2" y="3" width="12" height="10" rx="1" fill={color} opacity="0.98" />
      
      {/* Calendar header */}
      <rect x="2" y="2" width="12" height="2" rx="1" fill={color} opacity="0.99" />
      
      {/* Calendar binding holes */}
      <circle cx="4" cy="3" r="0.5" fill="#FFFFFF" />
      <circle cx="8" cy="3" r="0.5" fill="#FFFFFF" />
      <circle cx="12" cy="3" r="0.5" fill="#FFFFFF" />
      
      {/* Calendar grid lines */}
      <rect x="3" y="5" width="10" height="0.3" fill={color} opacity="0.93" />
      <rect x="3" y="7" width="10" height="0.3" fill={color} opacity="0.93" />
      <rect x="3" y="9" width="10" height="0.3" fill={color} opacity="0.96" />
      <rect x="3" y="11" width="10" height="0.3" fill={color} opacity="0.93" />
      
      {/* Vertical grid lines */}
      <rect x="5" y="5" width="0.3" height="6" fill={color} opacity="0.96" />
      <rect x="8" y="5" width="0.3" height="6" fill={color} opacity="0.93" />
      <rect x="11" y="5" width="0.3" height="6" fill={color} opacity="0.96" />
    </svg>
  )
}

function ProfileIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* User profile icon */}
      <circle cx="12" cy="8" r="4" fill={color} />
      <path d="M6 21C6 17.5 8.5 15 12 15C15.5 15 18 17.5 18 21" fill={color} />
    </svg>
  )
}

function ManageAccessIcon({ color = colors.accent }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield with key icon for access management */}
      <path d="M12 2L4 6V12C4 16.5 6.5 20.5 12 22C17.5 20.5 20 16.5 20 12V6L12 2Z" fill={color} opacity="0.9"/>
      <path d="M9 12L11 14L15 10" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="8" r="2" fill="#FFFFFF"/>
    </svg>
  )
}


export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user } = useUser()
  
  
  const onLogout = () => {
    localStorage.removeItem('token')
    navigate('/', { replace: true })
  }

  // Define navigation items based on user role (memoized for performance)
  const navigationItems = useMemo(() => {
    if (!user) {
      return []
    }

    const allItems = [
      { to: '/dashboard', label: 'Dashboard', icon: DashboardGridIcon },
      { to: '/menu', label: 'Menu', icon: MenuIcon },
      { to: '/orders', label: 'Order/Table', icon: OrdersIcon },
      { to: '/reservation', label: 'Reservation', icon: ReservationIcon },
    ]

    const staffItems = [
      { to: '/staff', label: 'Staff', icon: StaffIcon },
      { to: '/inventory', label: 'Inventory', icon: InventoryIcon },
    ]

    const adminItems = [
      { to: '/reports', label: 'Reports', icon: ReportsIcon },
    ]

    let items = [...allItems]

    // Only add staff items for STAFF and ADMIN roles
    if (user.role === 'STAFF' || user.role === 'ADMIN') {
      items = [...items, ...staffItems]
    }

    // Only add admin items for ADMIN role
    if (user.role === 'ADMIN') {
      items = [...items, ...adminItems]
    }
    
    return items
  }, [user?.role])
  
  return (
    <aside style={{ 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      bottom: 0, 
      width: 176, 
      padding: 24, 
      background: colors.panel, 
      borderRadius: '0px 30px 30px 0px',
      zIndex: 1000
    }}>
      <div style={{ 
        fontFamily: 'Poppins, system-ui, sans-serif', 
        fontWeight: 600, 
        fontSize: 20.0588, 
        lineHeight: '30px', 
        textAlign: 'center', 
        color: colors.accent, 
        marginBottom: 16 
      }}>
        COSYPOS
      </div>
      
      <nav style={{ display: 'grid', gap: 8 }}>
        {navigationItems.length > 0 ? (
          navigationItems.map((item, index) => (
            <NavCard 
              key={index}
              to={item.to} 
              label={item.label} 
              icon={item.icon} 
              active={
                item.to === '/staff' 
                  ? location.pathname === '/staff' || location.pathname.startsWith('/staff/')
                  : item.to === '/manage-access'
                  ? location.pathname === '/manage-access' || location.pathname.startsWith('/manage-access/')
                  : location.pathname === item.to
              } 
            />
          ))
        ) : (
          <div style={{ 
            color: colors.muted, 
            textAlign: 'center', 
            padding: '20px',
            fontSize: 14
          }}>
            Loading navigation...
          </div>
        )}
      </nav>
      
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
        <button onClick={() => setShowLogoutConfirm(true)} style={{ 
          width: '100%', 
          padding: '12px 16px', 
          borderRadius: 8, 
          background: 'transparent', 
          border: 'none', 
          color: colors.text, 
          fontWeight: 400, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          {/* Logout Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.45 21 3.95 20.78 3.59 20.41C3.22 20.05 3 19.55 3 19V5C3 4.45 3.22 3.95 3.59 3.59C3.95 3.22 4.45 3 5 3H9" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
      
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: colors.panel,
            borderRadius: 12,
            padding: 24,
            maxWidth: 400,
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: 600,
              margin: '0 0 12px 0',
              textAlign: 'center'
            }}>
              Confirm Logout
            </h3>
            <p style={{
              color: colors.muted,
              fontSize: 14,
              lineHeight: '20px',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: 'transparent',
                  border: '1px solid #3D4142',
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#3D4142'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: '#FF4444',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#FF3333'}
                onMouseOut={(e) => e.target.style.background = '#FF4444'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
