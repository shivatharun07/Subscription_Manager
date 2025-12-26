import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '15px 30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(255,255,255,0.2)'
    }}>
      <Link 
        to="/" 
        style={{ 
          color: '#333', 
          textDecoration: 'none', 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        📊 Subscription Manager
      </Link>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ 
              color: '#666', 
              fontSize: '14px',
              marginRight: '10px'
            }}>
              Welcome, {user.name || 'User'}!
            </span>
            <Link 
              to="/add-subscription" 
              className="btn btn-primary"
              style={{ 
                textDecoration: 'none',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              ➕ Add Subscription
            </Link>
            <button 
              onClick={logout} 
              className="btn btn-danger"
              style={{ fontSize: '14px', padding: '10px 20px' }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="btn btn-primary"
              style={{ 
                textDecoration: 'none',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              🔑 Login
            </Link>
            <Link 
              to="/register" 
              className="btn btn-secondary"
              style={{ 
                textDecoration: 'none',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;