import { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser, setShowRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({ token: response.data.token, ...response.data.user });
      } else {
        setError('Login successful but no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#1a1d29'
    }}>
      <div className="modal" style={{ position: 'relative', margin: 0 }}>
        <div className="modal-header">
          <h2 className="modal-title">Welcome Back</h2>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #3a3d4a' }}>
          <p style={{ color: '#8b8d97', marginBottom: '10px' }}>Don't have an account?</p>
          <button 
            onClick={() => setShowRegister(true)}
            className="btn btn-secondary"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;