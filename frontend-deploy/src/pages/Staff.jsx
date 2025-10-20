import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Bell } from 'lucide-react';
import { useUser } from './UserContext';
import Sidebar from './Sidebar.jsx';
import HeaderBar from './HeaderBar.jsx';
import AddEditPanel from './AddEditPanel.jsx';

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  accent: '#FAC1D9',
  text: '#FFFFFF',
  muted: '#777979',
  line: '#3D4142',
  inputBg: '#3D4142',
  inputBorder: '#5E5E5E',
};

function Header({ onAdd, count, activeTab, setActiveTab, sortBy, sortOrder, onSort, user }) {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  return (
    <>
      <HeaderBar title="Staff Management" showBackButton={true} right={(
        <>
          {/* Notification Bell Container */}
          <div 
            onClick={() => navigate('/notifications')}
            style={{ 
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Bell Icon */}
            <Bell size={20} color="#FFFFFF" />
            
            {/* Notification Badge */}
            <div style={{ 
              position: 'absolute',
              width: 10.4,
              height: 10.4,
              top: -2,
              right: -2,
              background: colors.accent,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: 5.94335,
                lineHeight: '9px',
                color: '#333333',
                textAlign: 'center'
              }}>
                01
              </span>
            </div>
          </div>

          {/* Separator Line */}
          <div style={{ 
            width: 0,
            height: 22.29,
            border: '0.742918px solid #FFFFFF',
            margin: '0 8px'
          }} />

          {/* User Profile */}
          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              width: 37.15,
              height: 37.15,
              borderRadius: '50%',
              border: '1.48584px solid #FAC1D9',
              background: '#D9D9D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.borderColor = '#FFB6C1'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.borderColor = '#FAC1D9'
            }}
          >
            <img 
              src={user?.profileImage ? user.profileImage : "/profile img icon.jpg"} 
              alt="Profile" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
              onError={(e) => {
                // Fallback to default image if uploaded image fails to load
                e.target.src = "/profile img icon.jpg";
              }}
            />
          </div>

        </>
      )} />
      <div style={{ marginLeft: 176, marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 25, fontWeight: 500 }}>Staff ({count})</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Only show Add Staff button for ADMIN users */}
          {user?.role === 'ADMIN' && (
            <button onClick={onAdd} style={{ background: colors.accent, color: '#333', border: 'none', padding: '14px 22px', borderRadius: 7, fontWeight: 500 }}>Add Staff</button>
          )}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              style={{ 
                background: '#3D4142', 
                color: '#fff', 
                border: 'none', 
                padding: '13px 20px', 
                borderRadius: 10, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4A4F50'}
              onMouseLeave={(e) => e.target.style.background = '#3D4142'}
            >
              <span style={{ fontWeight: 300 }}>Sort by {sortBy}</span>
              <span style={{ 
                width: 17, 
                height: 17, 
                border: '1.5px solid #fff', 
                borderTop: 'none', 
                borderLeft: 'none', 
                transform: sortOrder === 'asc' ? 'rotate(45deg)' : 'rotate(225deg)',
                transition: 'transform 0.2s ease'
              }} />
            </button>
            
            {/* Sort Dropdown */}
            {isSortOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: colors.panel,
                borderRadius: 8,
                border: `1px solid ${colors.accent}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 1000,
                minWidth: 200,
                maxWidth: 300
              }}>
                <div style={{ padding: 8 }}>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'role', label: 'Role' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'age', label: 'Age' },
                    { key: 'salary', label: 'Salary' },
                    { key: 'timings', label: 'Timings' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        onSort(option.key);
                        setIsSortOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: sortBy === option.key ? colors.accent : 'transparent',
                        color: sortBy === option.key ? '#333' : colors.text,
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: sortBy === option.key ? 500 : 400,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.key) {
                          e.target.style.background = '#3D4142'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.key) {
                          e.target.style.background = 'transparent'
                        }
                      }}
                    >
                      {option.label}
                      {sortBy === option.key && (
                        <span style={{ fontSize: 12 }}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: 208, paddingLeft: 20, marginTop: 16, display: 'flex', alignItems: 'center', gap: 35 }}>
        <button 
          onClick={() => setActiveTab('management')} 
          style={{ 
            background: activeTab === 'management' ? colors.accent : 'transparent', 
            color: activeTab === 'management' ? '#333' : '#fff', 
            border: 'none', 
            fontWeight: 500,
            padding: '14px 22px',
            borderRadius: 7,
            cursor: 'pointer'
          }}
        >
          Staff Management
        </button>
        {/* Only show Attendance tab for ADMIN users */}
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setActiveTab('attendance')} 
            style={{ 
              background: activeTab === 'attendance' ? colors.accent : 'transparent', 
              color: activeTab === 'attendance' ? '#333' : '#fff', 
              border: 'none', 
              fontWeight: 500,
              padding: '14px 22px',
              borderRadius: 7,
              cursor: 'pointer'
            }}
          >
            Attendance
          </button>
        )}
      </div>
    </>
  );
}

function TableHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 25px', borderBottom: `1px solid ${colors.line}`, background: colors.panel, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <div style={{ width: 20 }}><div style={{ width: 11, height: 11, border: '1px solid #fff' }} /></div>
      <div style={{ width: 60, fontWeight: 500, fontSize: 14 }}>ID</div>
      <div style={{ width: 260, fontWeight: 500, fontSize: 14 }}>Name</div>
      <div style={{ width: 260, fontWeight: 500, fontSize: 14 }}>Email</div>
      <div style={{ width: 180, fontWeight: 500, fontSize: 14 }}>Phone</div>
      <div style={{ width: 80, fontWeight: 500, fontSize: 14, textAlign: 'right' }}>Age</div>
      <div style={{ width: 120, fontWeight: 500, fontSize: 14, textAlign: 'right' }}>Salary</div>
      <div style={{ width: 140, fontWeight: 500, fontSize: 14, textAlign: 'right' }}>Timings</div>
      <div style={{ marginLeft: 'auto', width: 100, fontWeight: 500, fontSize: 14, textAlign: 'right' }}>Actions</div>
    </div>
  );
}

function AttendanceTableHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 25px', borderBottom: `1px solid ${colors.line}`, background: colors.panel, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <div style={{ width: 20 }}><div style={{ width: 11, height: 11, border: '1px solid #fff' }} /></div>
      <div style={{ width: 60, fontWeight: 500, fontSize: 14 }}>ID</div>
      <div style={{ width: 200, fontWeight: 500, fontSize: 14 }}>Name</div>
      <div style={{ width: 120, fontWeight: 500, fontSize: 14 }}>Date</div>
      <div style={{ width: 140, fontWeight: 500, fontSize: 14 }}>Timings</div>
      <div style={{ marginLeft: 'auto', width: 200, fontWeight: 500, fontSize: 14, textAlign: 'right' }}>Status</div>
    </div>
  );
}

function StaffRow({ staff, onEdit, onDelete, zebra, user }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '100%',
        height: 70, 
        background: isHovered ? '#3D4142' : colors.panel, 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 20px',
        marginBottom: 1,
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      }}>
      {/* Checkbox */}
      <div style={{ 
        width: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
      }}>
        <div style={{ 
          width: 16,
          height: 16,
          border: '1px solid #FFFFFF',
          borderRadius: 2
        }} />
      </div>
      
      {/* ID */}
      <div style={{ 
        width: 60,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        {staff.id}
      </div>
      
      {/* Name and Role with Profile Picture */}
      <div style={{ 
        width: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginRight: 30
      }}>
        {/* Profile Picture */}
        <div style={{ 
          width: 27,
          height: 27,
          borderRadius: '50%',
          border: '1px solid #FAC1D9',
          background: '#111827',
          flex: 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/client img.png" 
            alt={staff.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
        </div>
        
        {/* Name and Role */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <div style={{ 
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: 14,
            color: '#FFFFFF',
            marginBottom: 2
          }}>
            {staff.name}
          </div>
          <div style={{ 
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: 12,
            color: '#FAC1D9'
          }}>
            {staff.role}
          </div>
        </div>
      </div>
      
      {/* Email */}
      <div style={{ 
        width: 200,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        {staff.email}
      </div>
      
      {/* Phone */}
      <div style={{ 
        width: 150,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        {staff.phone}
      </div>
      
      {/* Age */}
      <div style={{ 
        width: 80,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginRight: 30
      }}>
        {staff.age || '45 yr'}
      </div>
      
      {/* Salary */}
      <div style={{ 
        width: 100,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginRight: 30
      }}>
        {staff.salary || '$2200.00'}
      </div>
      
      {/* Timings */}
      <div style={{ 
        width: 120,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginRight: 30
      }}>
        {staff.timings || '9am to 6pm'}
      </div>
      
      {/* Action Buttons */}
      <div onClick={(e) => e.stopPropagation()} style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 15,
        marginLeft: 'auto'
      }}>
        {/* View Button - Eye Icon - Available for all users */}
        <button onClick={() => navigate(`/staff/${encodeURIComponent(staff.id)}`)} style={{ 
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 60,
          height: 60,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
          <FiEye size={36} color="#FAC1D9" />
        </button>
        
        {/* Edit and Delete Buttons - Only for ADMIN users */}
        {user?.role === 'ADMIN' && (
          <>
            {/* Edit Button - Pencil Icon */}
            <button onClick={() => onEdit(staff)} style={{ 
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              <FiEdit3 size={36} color="#FFFFFF" />
            </button>
            
            {/* Delete Button - Trash Can Icon */}
            <button onClick={() => onDelete(staff.id)} style={{ 
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              <FiTrash2 size={36} color="#E70000" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AttendanceRow({ staff, attendanceStatus, onStatusChange, user }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusButtons = [
    { key: 'present', label: 'Present', color: '#FAC1D9', textColor: '#333' },
    { key: 'absent', label: 'Absent', color: '#FFD700', textColor: '#333' },
    { key: 'half', label: 'Half Shift', color: '#87CEEB', textColor: '#333' },
    { key: 'leave', label: 'Leave', color: '#FF6B6B', textColor: '#fff' }
  ];
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '100%',
        height: 70, 
        background: isHovered ? '#3D4142' : colors.panel, 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 20px',
        marginBottom: 1,
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      }}>
      {/* Checkbox */}
      <div style={{ 
        width: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
      }}>
        <div style={{ 
          width: 16,
          height: 16,
          border: '1px solid #FFFFFF',
          borderRadius: 2
        }} />
      </div>
      
      {/* ID */}
      <div style={{ 
        width: 60,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        {staff.id}
      </div>
      
      {/* Name and Role with Profile Picture */}
      <div style={{ 
        width: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginRight: 30
      }}>
        {/* Profile Picture */}
        <div style={{ 
          width: 27,
          height: 27,
          borderRadius: '50%',
          border: '1px solid #FAC1D9',
          background: '#111827',
          flex: 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/client img.png" 
            alt={staff.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
        </div>
        
        {/* Name and Role */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <div style={{ 
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: 14,
            color: '#FFFFFF',
            marginBottom: 2
          }}>
            {staff.name}
          </div>
          <div style={{ 
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: 12,
            color: '#FAC1D9'
          }}>
            {staff.role}
          </div>
        </div>
      </div>
      
      {/* Date */}
      <div style={{ 
        width: 120,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        16-Apr-2024
      </div>
      
      {/* Timings */}
      <div style={{ 
        width: 140,
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 30
      }}>
        {staff.timings || '9am to 6pm'}
      </div>
      
      {/* Status Buttons - Only for ADMIN users */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        marginLeft: 'auto'
      }}>
        {user?.role === 'ADMIN' ? (
          attendanceStatus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{
                background: statusButtons.find(s => s.key === attendanceStatus)?.color || '#FAC1D9',
                color: statusButtons.find(s => s.key === attendanceStatus)?.textColor || '#333',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                {statusButtons.find(s => s.key === attendanceStatus)?.label}
              </button>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 4,
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                <FiEdit3 size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              {statusButtons.map((status) => (
                <button
                  key={status.key}
                  onClick={() => onStatusChange(staff.id, status.key)}
                  style={{
                    background: status.color,
                    color: status.textColor,
                    border: 'none',
                    padding: '10px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )
        ) : (
          /* For non-admin users, just show the current status as read-only */
          <div style={{ 
            padding: '10px 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            background: attendanceStatus ? 
              (statusButtons.find(s => s.key === attendanceStatus)?.color || '#FAC1D9') : 
              '#3D4142',
            color: attendanceStatus ? 
              (statusButtons.find(s => s.key === attendanceStatus)?.textColor || '#333') : 
              '#FFFFFF'
          }}>
            {attendanceStatus ? 
              statusButtons.find(s => s.key === attendanceStatus)?.label : 
              'Not Set'
            }
          </div>
        )}
      </div>
    </div>
  );
}


export default function Staff() {
  const { user } = useUser();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editInitial, setEditInitial] = useState(null);
  const [activeTab, setActiveTab] = useState('management'); // 'management' or 'attendance'
  const [attendanceStatus, setAttendanceStatus] = useState({}); // Track attendance status for each staff member
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [list, setList] = useState(() => [
    { id: '#101', name: 'Watson Joyce', role: 'Manager', phone: '+1 (123) 123 4654', email: 'watsonjoyce112@gmail.com', age: '45 yr', salary: '$2200.00', timings: '9am to 6pm', active: true },
    { id: '#102', name: 'Sarah Johnson', role: 'Staff', phone: '+1 (123) 123 4655', email: 'sarah.johnson@email.com', age: '32 yr', salary: '$1800.00', timings: '8am to 5pm', active: true },
    { id: '#103', name: 'Mike Wilson', role: 'Chef', phone: '+1 (123) 123 4656', email: 'mike.wilson@email.com', age: '38 yr', salary: '$2500.00', timings: '10am to 7pm', active: true },
    { id: '#104', name: 'Emily Davis', role: 'Staff', phone: '+1 (123) 123 4657', email: 'emily.davis@email.com', age: '28 yr', salary: '$1600.00', timings: '9am to 6pm', active: true },
    { id: '#105', name: 'David Brown', role: 'Manager', phone: '+1 (123) 123 4658', email: 'david.brown@email.com', age: '42 yr', salary: '$2300.00', timings: '8am to 5pm', active: true },
    { id: '#106', name: 'Lisa Anderson', role: 'Staff', phone: '+1 (123) 123 4659', email: 'lisa.anderson@email.com', age: '29 yr', salary: '$1700.00', timings: '9am to 6pm', active: true },
    { id: '#107', name: 'James Taylor', role: 'Chef', phone: '+1 (123) 123 4660', email: 'james.taylor@email.com', age: '35 yr', salary: '$2400.00', timings: '11am to 8pm', active: true },
    { id: '#108', name: 'Maria Garcia', role: 'Staff', phone: '+1 (123) 123 4661', email: 'maria.garcia@email.com', age: '31 yr', salary: '$1650.00', timings: '8am to 5pm', active: true },
    { id: '#109', name: 'Robert Lee', role: 'Manager', phone: '+1 (123) 123 4662', email: 'robert.lee@email.com', age: '48 yr', salary: '$2600.00', timings: '9am to 6pm', active: true },
    { id: '#110', name: 'Jennifer White', role: 'Staff', phone: '+1 (123) 123 4663', email: 'jennifer.white@email.com', age: '26 yr', salary: '$1550.00', timings: '10am to 7pm', active: true },
    { id: '#111', name: 'Michael Clark', role: 'Chef', phone: '+1 (123) 123 4664', email: 'michael.clark@email.com', age: '41 yr', salary: '$2450.00', timings: '9am to 6pm', active: true },
    { id: '#112', name: 'Amanda Rodriguez', role: 'Staff', phone: '+1 (123) 123 4665', email: 'amanda.rodriguez@email.com', age: '33 yr', salary: '$1750.00', timings: '8am to 5pm', active: true },
    { id: '#113', name: 'Christopher Hall', role: 'Manager', phone: '+1 (123) 123 4666', email: 'christopher.hall@email.com', age: '39 yr', salary: '$2350.00', timings: '9am to 6pm', active: true },
    { id: '#114', name: 'Jessica Martinez', role: 'Staff', phone: '+1 (123) 123 4667', email: 'jessica.martinez@email.com', age: '27 yr', salary: '$1600.00', timings: '10am to 7pm', active: true },
    { id: '#115', name: 'Daniel Young', role: 'Chef', phone: '+1 (123) 123 4668', email: 'daniel.young@email.com', age: '36 yr', salary: '$2300.00', timings: '11am to 8pm', active: true },
    { id: '#116', name: 'Ashley King', role: 'Staff', phone: '+1 (123) 123 4669', email: 'ashley.king@email.com', age: '30 yr', salary: '$1700.00', timings: '9am to 6pm', active: true },
    { id: '#117', name: 'Matthew Wright', role: 'Manager', phone: '+1 (123) 123 4670', email: 'matthew.wright@email.com', age: '44 yr', salary: '$2500.00', timings: '8am to 5pm', active: true },
    { id: '#118', name: 'Stephanie Lopez', role: 'Staff', phone: '+1 (123) 123 4671', email: 'stephanie.lopez@email.com', age: '28 yr', salary: '$1650.00', timings: '10am to 7pm', active: true },
    { id: '#119', name: 'Andrew Hill', role: 'Chef', phone: '+1 (123) 123 4672', email: 'andrew.hill@email.com', age: '37 yr', salary: '$2400.00', timings: '9am to 6pm', active: true },
    { id: '#120', name: 'Nicole Scott', role: 'Staff', phone: '+1 (123) 123 4673', email: 'nicole.scott@email.com', age: '32 yr', salary: '$1800.00', timings: '8am to 5pm', active: true },
    { id: '#121', name: 'Kevin Green', role: 'Manager', phone: '+1 (123) 123 4674', email: 'kevin.green@email.com', age: '46 yr', salary: '$2550.00', timings: '9am to 6pm', active: true },
    { id: '#122', name: 'Rachel Adams', role: 'Staff', phone: '+1 (123) 123 4675', email: 'rachel.adams@email.com', age: '29 yr', salary: '$1750.00', timings: '10am to 7pm', active: true },
  ]);

  const openAdd = () => { setEditInitial(null); setPanelOpen(true); };
  const openEdit = (s) => { setEditInitial(s); setPanelOpen(true); };
  const onClosePanel = (updated) => {
    if (updated) {
      setList((prev) => {
        const idx = prev.findIndex((p) => p.id === updated.id);
        if (idx >= 0) {
          const copy = prev.slice();
          copy[idx] = updated;
          return copy;
        }
        return [updated, ...prev];
      });
    }
    setPanelOpen(false);
  };
  const onDelete = (id) => setList((prev) => prev.filter((p) => p.id !== id));
  const handleAttendanceStatusChange = (staffId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [staffId]: status
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortStaff = (staffList) => {
    return [...staffList].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        case 'age':
          aValue = parseInt(a.age);
          bValue = parseInt(b.age);
          break;
        case 'salary':
          aValue = parseFloat(a.salary.replace('$', '').replace(',', ''));
          bValue = parseFloat(b.salary.replace('$', '').replace(',', ''));
          break;
        case 'timings':
          aValue = a.timings.toLowerCase();
          bValue = b.timings.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedList = useMemo(() => sortStaff(list), [list, sortBy, sortOrder]);
  
  const rows = useMemo(() => sortedList.map((s, i) => (
    <StaffRow key={s.id} staff={s} onEdit={openEdit} onDelete={onDelete} zebra={i % 2 === 1} user={user} />
  )), [sortedList, user]);

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text }}>
      <div style={{ width: 1440, margin: '0 auto', position: 'relative' }}>
        <Sidebar />
        <Header onAdd={openAdd} count={list.length} activeTab={activeTab} setActiveTab={setActiveTab} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} user={user} />
        <main style={{ paddingTop: 20, paddingBottom: 40, marginLeft: 176 }}>
          {activeTab === 'management' ? (
            <>
              {/* Column Headers */}
              <div style={{ 
                width: '100%',
                height: 50,
                background: colors.panel,
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                marginBottom: 1,
                borderBottom: '1px solid #3D4142'
              }}>
                {/* Checkbox column */}
                <div style={{ width: 20, marginRight: 20 }}></div>
                
                {/* ID */}
                <div style={{ 
                  width: 60,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>ID</div>
                
                {/* Name */}
                <div style={{ 
                  width: 200,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Name</div>
                
                {/* Email */}
                <div style={{ 
                  width: 200,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Email</div>
                
                {/* Phone */}
                <div style={{ 
                  width: 150,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Phone</div>
                
                 {/* Age */}
                 <div style={{ 
                   width: 80,
                   fontFamily: 'Poppins',
                   fontWeight: 500,
                   fontSize: 14,
                   color: '#FFFFFF',
                   textAlign: 'left',
                   marginRight: 30,
                   paddingLeft: 5
                 }}>Age</div>
                 
                 {/* Salary */}
                 <div style={{ 
                   width: 100,
                   fontFamily: 'Poppins',
                   fontWeight: 500,
                   fontSize: 14,
                   color: '#FFFFFF',
                   textAlign: 'left',
                   marginRight: 30,
                   paddingLeft: 5
                 }}>Salary</div>
                 
                 {/* Timings */}
                 <div style={{ 
                   width: 120,
                   fontFamily: 'Poppins',
                   fontWeight: 500,
                   fontSize: 14,
                   color: '#FFFFFF',
                   textAlign: 'left',
                   marginRight: 30,
                   paddingLeft: 5
                 }}>Timings</div>
                 
                 {/* Actions */}
                 <div style={{ 
                   fontFamily: 'Poppins',
                   fontWeight: 500,
                   fontSize: 14,
                   color: '#FFFFFF',
                   marginLeft: 'auto',
                   paddingLeft: 5
                 }}>Actions</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {rows}
              </div>
            </>
          ) : (
            <>
              {/* Attendance Column Headers */}
              <div style={{ 
                width: '100%',
                height: 50,
                background: colors.panel,
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                marginBottom: 1,
                borderBottom: '1px solid #3D4142'
              }}>
                <div style={{ width: 20, marginRight: 20 }}></div>
                <div style={{ 
                  width: 60,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>ID</div>
                <div style={{ 
                  width: 200,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Name</div>
                <div style={{ 
                  width: 120,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Date</div>
                <div style={{ 
                  width: 140,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginRight: 30
                }}>Timings</div>
                <div style={{ 
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#FFFFFF',
                  marginLeft: 'auto'
                }}>Status</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {list.map((staff, i) => (
                  <AttendanceRow 
                    key={staff.id} 
                    staff={staff} 
                    attendanceStatus={attendanceStatus[staff.id]}
                    onStatusChange={handleAttendanceStatusChange}
                    zebra={i % 2 === 1}
                    user={user}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <AddEditPanel open={panelOpen} onClose={onClosePanel} initial={editInitial} />
    </div>
  );
}


