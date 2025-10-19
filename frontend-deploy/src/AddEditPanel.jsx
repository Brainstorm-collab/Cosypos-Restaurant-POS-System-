import React, { useState } from 'react'

const colors = {
  panel: '#292C2D',
  text: '#FFFFFF',
  inputBg: '#3D4142',
  accent: '#FAC1D9',
  muted: '#777979',
  line: '#3D4142',
}

function AddEditPanel({ open, onClose, initial }) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [role, setRole] = useState(initial?.role || '');
  const [salary, setSalary] = useState(initial?.salary || '');
  const [startTiming, setStartTiming] = useState(initial?.startTiming || '');
  const [endTiming, setEndTiming] = useState(initial?.endTiming || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [dateOfBirth, setDateOfBirth] = useState(initial?.dateOfBirth || '');
  const [additionalDetails, setAdditionalDetails] = useState(initial?.additionalDetails || '');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.profileImage || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Prevent body scrolling when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: wire to backend later
    onClose({ 
      id: initial?.id || Math.random().toString(36).slice(2), 
      name, 
      email, 
      phone, 
      role, 
      salary,
      startTiming,
      endTiming,
      address,
      dateOfBirth,
      additionalDetails,
      profileImage
    });
  };

  if (!open) return null;
  
  return (
    <div onClick={() => onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000, overflow: 'hidden', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 640, height: '100vh', background: colors.panel, borderRadius: '30px 0 0 30px', padding: 40, color: colors.text, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={() => onClose()} 
              style={{ 
                background: colors.inputBg, 
                border: 'none', 
                borderRadius: '50%', 
                width: 36, 
                height: 36, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: colors.text, 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 16,
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#3D4142'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = colors.inputBg
                e.target.style.transform = 'scale(1)'
              }}
            >
              &lt;
            </button>
            <div style={{ fontSize: 25, fontWeight: 500 }}>{isEdit ? 'Edit Staff' : 'Add Staff'}</div>
          </div>
          <button 
            onClick={() => onClose()} 
            style={{ 
              background: colors.inputBg, 
              border: 'none', 
              borderRadius: '50%', 
              width: 36, 
              height: 36, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: colors.text, 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: 16,
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3D4142'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.inputBg
              e.target.style.transform = 'scale(1)'
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Profile Picture Upload */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            background: colors.inputBg, 
            borderRadius: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : isEdit ? (
              <img 
                src="/client img.png" 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: 30, color: colors.muted }}>🏔️</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0, 
                cursor: 'pointer' 
              }}
            />
          </div>
          <button 
            type="button"
            onClick={() => document.querySelector('input[type="file"]').click()}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: colors.muted, 
              fontSize: 14, 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Change Profile Picture
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, flex: 1 }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Full Name</div>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter full name" 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Email</div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter email address" 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Role</div>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }}
                >
                  <option value="">Select role</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Chef">Chef</option>
                </select>
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Phone number</div>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Enter phone number" 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Salary</div>
                <input 
                  value={salary} 
                  onChange={(e) => setSalary(e.target.value)} 
                  placeholder="Enter Salary" 
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Date of birth</div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date"
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)} 
                    placeholder="Enter date of birth" 
                    style={{ width: '100%', padding: 12, paddingRight: 35, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                  />
                  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: colors.muted, fontSize: 12 }}>📅</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Shift start timing</div>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={startTiming} 
                    onChange={(e) => setStartTiming(e.target.value)} 
                    placeholder="Enter start timing" 
                    style={{ width: '100%', padding: 12, paddingRight: 35, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                  />
                  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: colors.muted, fontSize: 12 }}>🕐</div>
                </div>
              </div>
              
              <div>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Shift end timing</div>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={endTiming} 
                    onChange={(e) => setEndTiming(e.target.value)} 
                    placeholder="Enter end timing" 
                    style={{ width: '100%', padding: 12, paddingRight: 35, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, fontSize: 14, minHeight: 40, boxSizing: 'border-box' }} 
                  />
                  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: colors.muted, fontSize: 12 }}>🕐</div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Address</div>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter address" 
                  rows={2}
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, resize: 'none', fontSize: 14, minHeight: 60, boxSizing: 'border-box' }} 
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 4, fontWeight: 500, color: colors.text, fontSize: 14 }}>Additional details</div>
                <textarea 
                  value={additionalDetails} 
                  onChange={(e) => setAdditionalDetails(e.target.value)} 
                  placeholder="Enter additional details" 
                  rows={2}
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: colors.inputBg, color: colors.text, resize: 'none', fontSize: 14, minHeight: 60, boxSizing: 'border-box' }} 
                />
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${colors.line}` }}>
            <button 
              type="button" 
              onClick={() => onClose()} 
              style={{ 
                padding: '10px 20px', 
                borderRadius: 6, 
                background: colors.inputBg, 
                border: 'none', 
                color: colors.text, 
                fontSize: 14, 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 20px', 
                borderRadius: 6, 
                background: colors.accent, 
                border: 'none', 
                color: '#333', 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditPanel
