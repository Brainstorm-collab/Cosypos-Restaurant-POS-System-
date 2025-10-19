import { useNavigate } from 'react-router-dom'

const colors = {
  panel: '#292C2D',
  text: '#FFFFFF',
}

export default function HeaderBar({ title, right, showBackButton = false, onBackClick }) {
  const navigate = useNavigate()
  
  const handleBack = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }
  
  return (
    <header style={{ 
      marginLeft: 208,
      paddingLeft: 20,
      paddingRight: 12, 
      paddingTop: 40, 
      paddingBottom: 20,
      display: 'flex', 
      alignItems: 'center', 
      gap: 16,
      background: '#111315',
      borderBottom: '1px solid #3D4142'
    }}>
      {showBackButton && (
        <button 
          onClick={handleBack}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: colors.panel, 
            border: 'none',
            color: colors.text,
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          &lt;
        </button>
      )}
      <div style={{ fontSize: 25, fontWeight: 500, color: colors.text }}>{title}</div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {right}
      </div>
    </header>
  )
}


