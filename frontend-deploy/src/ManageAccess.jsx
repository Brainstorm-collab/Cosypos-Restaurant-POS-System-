import { useState } from 'react'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  accent: '#FAC1D9',
  text: '#FFFFFF',
  muted: '#777979',
}

function EyeIcon({ color = colors.muted }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}


function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? colors.accent : '#3D4142',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#FFFFFF',
        position: 'absolute',
        top: 2,
        left: checked ? 22 : 2,
        transition: 'left 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  )
}

export default function ManageAccess() {
  const [newUser, setNewUser] = useState({
    firstName: '',
    email: '',
    role: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Abubakar Sherazi',
      email: 'abubakarsherazi@gmail.com',
      role: 'Admin',
      permissions: {
        dashboard: true,
        reports: true,
        inventory: true,
        orders: true,
        customers: true,
        settings: true
      }
    },
    {
      id: 2,
      name: 'Anees Ansari',
      email: 'aneesansari@gmail.com',
      role: 'Sub admin',
      permissions: {
        dashboard: false,
        reports: true,
        inventory: true,
        orders: true,
        customers: true,
        settings: true
      }
    }
  ])

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddUser = () => {
    if (newUser.firstName && newUser.email && newUser.role && newUser.password) {
      const user = {
        id: users.length + 1,
        name: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
        permissions: {
          dashboard: false,
          reports: false,
          inventory: false,
          orders: false,
          customers: false,
          settings: false
        }
      }
      setUsers(prev => [...prev, user])
      setNewUser({ firstName: '', email: '', role: '', password: '' })
    }
  }

  const handlePermissionChange = (userId, permission, value) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, permissions: { ...user.permissions, [permission]: value } }
        : user
    ))
  }

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: 20,
      maxWidth: '100%',
      overflow: 'hidden',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Add New User Section */}
      <div style={{
        width: 320,
        minWidth: 300,
        maxWidth: '38%',
        background: colors.panel,
        borderRadius: 12,
        padding: 20,
        height: 'fit-content',
        flexShrink: 0
      }}>
        <h3 style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.text,
          marginBottom: 10
        }}>
          Add New User
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* First Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4
            }}>
              First Name
            </label>
            <input
              type="text"
              value={newUser.firstName}
              onChange={(e) => handleNewUserChange('firstName', e.target.value)}
              style={{
              width: '100%',
              height: '36px',
              padding: '8px 12px',
              borderRadius: 6,
              background: colors.bg,
              border: '1px solid #3D4142',
              color: colors.text,
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.accent}
              onBlur={(e) => e.target.style.borderColor = '#3D4142'}
            />
          </div>
          
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4
            }}>
              Email
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange('email', e.target.value)}
              style={{
              width: '100%',
              height: '36px',
              padding: '8px 12px',
              borderRadius: 6,
              background: colors.bg,
              border: '1px solid #3D4142',
              color: colors.text,
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.accent}
              onBlur={(e) => e.target.style.borderColor = '#3D4142'}
            />
          </div>
          
          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4
            }}>
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) => handleNewUserChange('role', e.target.value)}
              style={{
              width: '100%',
              height: '36px',
              padding: '8px 12px',
              borderRadius: 6,
              background: colors.bg,
              border: '1px solid #3D4142',
              color: colors.text,
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.accent}
              onBlur={(e) => e.target.style.borderColor = '#3D4142'}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Sub admin">Sub admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          
          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4
            }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newUser.password}
                onChange={(e) => handleNewUserChange('password', e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  paddingRight: '40px',
                  borderRadius: 6,
                  background: colors.bg,
                  border: '1px solid #3D4142',
                  color: colors.text,
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.accent}
                onBlur={(e) => e.target.style.borderColor = '#3D4142'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: colors.muted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20
            }}
              >
                <EyeIcon />
              </button>
            </div>
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleAddUser}
            style={{
              width: '100%',
              background: colors.accent,
              border: 'none',
              color: '#333333',
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: 2
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Add
          </button>
        </div>
      </div>
      
      {/* User Access Management */}
      <div style={{ 
        flex: 1,
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          background: colors.panel,
          borderRadius: 12,
          padding: 16,
          maxWidth: '100%',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 10
          }}>
            User Access Management
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 10,
            flex: 1,
            overflow: 'auto'
          }}>
            {users.map(user => (
              <div key={user.id} style={{
                background: colors.bg,
                borderRadius: 4,
                padding: 10,
                border: '1px solid #3D4142',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 6
                }}>
                  <div>
                    <h4 style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.text,
                      margin: '0 0 2px 0'
                    }}>
                      {user.name}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 8
                    }}>
                      <span style={{
                        background: colors.accent,
                        color: '#333333',
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '1px 4px',
                        borderRadius: 2
                      }}>
                        {user.role}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 11,
                      color: colors.muted,
                      margin: 0
                    }}>
                      {user.email}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => console.log('Edit user:', user.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: colors.accent,
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#3D4142'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <FiEdit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#F44336',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#3D4142'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Permissions Section */}
                <div style={{ marginTop: 12 }}>
                  <h4 style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.text,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Permissions
                  </h4>
                </div>
                
                {/* Permissions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 12,
                  maxWidth: '100%',
                  marginTop: 8
                }}>
                  {Object.entries(user.permissions).map(([permission, enabled]) => (
                    <div key={permission} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: colors.panel,
                      borderRadius: 6,
                      border: '1px solid #3D4142',
                      minHeight: '40px'
                    }}>
                      <span style={{
                        fontSize: 12,
                        color: colors.text,
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        flex: 1,
                        marginRight: 8
                      }}>
                        {permission}
                      </span>
                      <ToggleSwitch
                        checked={enabled}
                        onChange={(value) => handlePermissionChange(user.id, permission, value)}
                        disabled={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
