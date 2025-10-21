import React, { useEffect } from 'react';

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  accent: '#FAC1D9',
  text: '#FFFFFF',
  muted: '#777979',
  success: '#FAC1D9',  // Pink for success to match theme
  error: '#FF6B9D',    // Lighter pink/red for errors
  warning: '#FFB6C1',  // Light pink for warnings
  info: '#E8A8C8'      // Muted pink for info
};

export default function Toast({ show, message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeStyles = {
    success: {
      bg: colors.success,
      icon: '✓',
      borderColor: colors.success,
      iconBg: colors.success,
      textColor: '#333333'
    },
    error: {
      bg: colors.error,
      icon: '✕',
      borderColor: colors.error,
      iconBg: colors.error,
      textColor: '#FFFFFF'
    },
    warning: {
      bg: colors.warning,
      icon: '⚠',
      borderColor: colors.warning,
      iconBg: colors.warning,
      textColor: '#333333'
    },
    info: {
      bg: colors.info,
      icon: 'ℹ',
      borderColor: colors.info,
      iconBg: colors.info,
      textColor: '#333333'
    }
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        minWidth: 320,
        maxWidth: 500,
        background: colors.panel,
        borderRadius: 12,
        border: `2px solid ${style.borderColor}`,
        padding: 18,
        boxShadow: '0 10px 40px rgba(250, 193, 217, 0.2), 0 4px 12px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        animation: 'slideInRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: style.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: style.textColor,
          fontSize: 20,
          fontWeight: 'bold',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${style.borderColor}40`
        }}
      >
        {style.icon}
      </div>

      {/* Message */}
      <div style={{ 
        flex: 1, 
        color: colors.text, 
        fontSize: 14, 
        fontWeight: 500,
        lineHeight: '1.5'
      }}>
        {message}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          background: 'rgba(119, 121, 121, 0.2)',
          border: 'none',
          color: colors.muted,
          fontSize: 18,
          cursor: 'pointer',
          padding: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          borderRadius: '50%',
          width: 28,
          height: 28
        }}
        onMouseEnter={(e) => {
          e.target.style.color = colors.text;
          e.target.style.background = 'rgba(250, 193, 217, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = colors.muted;
          e.target.style.background = 'rgba(119, 121, 121, 0.2)';
        }}
      >
        ✕
      </button>
    </div>
  );
}

