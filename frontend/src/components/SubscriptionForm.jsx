import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Software',
    cost: '',
    billingCycle: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    renewalDate: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Sending subscription data:', formData);
      const response = await axios.post('http://localhost:5000/api/v1/subscriptions', formData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Server response:', response.data);
      setSuccess('Subscription added successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error adding subscription:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to add subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '500px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>➕</div>
        <h2>Add New Subscription</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Keep track of your recurring expenses</p>
      </div>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📺 Service Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
            required
          />
        </div>

        <div className="form-group">
          <label>📁 Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Streaming">Streaming</option>
            <option value="Music">Music</option>
            <option value="Software">Software</option>
            <option value="Gaming">Gaming</option>
            <option value="Fitness">Fitness</option>
            <option value="Cloud Storage">Cloud Storage</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>💰 Cost ($):</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label>📅 Billing Cycle:</label>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            required
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>📅 Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            max={formData.renewalDate || ''}
            required
          />
        </div>

        <div className="form-group">
          <label>🔄 Next Renewal Date:</label>
          <input
            type="date"
            name="renewalDate"
            value={formData.renewalDate}
            onChange={handleChange}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label>📝 Description (Optional):</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional notes about this subscription"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? '🔄 Adding...' : '✅ Add Subscription'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ flex: 1 }}
            disabled={loading}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;