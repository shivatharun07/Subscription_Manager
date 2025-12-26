import { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a1d29',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Subscription Manager</h1>
          <button 
            onClick={() => setUser({ name: 'Test User' })}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Login as Test User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1d29', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1>Welcome {user.name}!</h1>
      <p>Dashboard is loading...</p>
      <button 
        onClick={() => setUser(null)}
        style={{
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default App;