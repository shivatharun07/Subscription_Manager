import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ currentPage }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    renewalDate: '',
    category: 'Entertainment'
  });

  useEffect(() => {
    if (currentPage === 'subscriptions' || currentPage === 'overview') {
      fetchSubscriptions();
    }
  }, [currentPage]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/subscriptions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ name: '', cost: '', billingCycle: 'monthly', renewalDate: '', category: 'Entertainment' });
      fetchSubscriptions();
    } catch (error) {
      setError('Failed to add subscription');
    }
  };

  const deleteSubscription = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubscriptions();
    } catch (error) {
      setError('Failed to delete subscription');
    }
  };

  const getServiceLogo = (name) => {
    const logos = {
      'netflix': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/netflix.svg',
      'spotify': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spotify.svg',
      'adobe': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobe.svg',
      'adobe creative cloud': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobecreativecloud.svg',
      'youtube': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg',
      'youtube premium': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg',
      'youtube music': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtubemusic.svg',
      'amazon': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazon.svg',
      'amazon prime': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonprime.svg',
      'prime video': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/primevideo.svg',
      'apple': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg',
      'apple music': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/applemusic.svg',
      'disney': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/disney.svg',
      'disney+': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/disneyplus.svg',
      'disney+ hotstar': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hotstar.svg',
      'hotstar': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hotstar.svg',
      'microsoft': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg',
      'microsoft 365': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft365.svg',
      'office 365': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft365.svg',
      'google': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg',
      'google workspace': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg',
      'google one': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg',
      'canva': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/canva.svg',
      'canva pro': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/canva.svg',
      'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg',
      'notion': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg',
      'jiosaavn': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jiosaavn.svg',
      'gaana': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gaana.svg',
      'wynk music': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/airtelindia.svg',
      'wynk': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/airtelindia.svg',
      'sony liv': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sonyliv.svg',
      'hulu': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hulu.svg',
      'hbo': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hbo.svg',
      'hbo max': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hbomax.svg',
      'paramount+': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/paramountplus.svg',
      'peacock': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/peacock.svg',
      'twitch': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twitch.svg',
      'discord': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/discord.svg',
      'slack': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg',
      'zoom': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zoom.svg',
      'dropbox': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dropbox.svg',
      'icloud': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/icloud.svg',
      'onedrive': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftonedrive.svg',
      'github': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg',
      'linkedin': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg',
      'tidal': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tidal.svg',
      'soundcloud': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/soundcloud.svg',
      'pandora': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pandora.svg',
      'deezer': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/deezer.svg'
    };
    const key = name.toLowerCase().trim();
    return logos[key] || null;
  };

  const getServiceColor = (name) => {
    const colors = {
      'netflix': '#E50914',
      'spotify': '#1DB954',
      'adobe': '#FF0000',
      'adobe creative cloud': '#DA1F26',
      'youtube': '#FF0000',
      'youtube premium': '#FF0000',
      'youtube music': '#FF0000',
      'amazon': '#FF9900',
      'amazon prime': '#00A8E1',
      'prime video': '#00A8E1',
      'apple': '#000000',
      'apple music': '#FA243C',
      'disney': '#113CCF',
      'disney+': '#113CCF',
      'disney+ hotstar': '#1F1F1F',
      'hotstar': '#1F1F1F',
      'microsoft': '#00A4EF',
      'microsoft 365': '#D83B01',
      'office 365': '#D83B01',
      'google': '#4285F4',
      'google workspace': '#4285F4',
      'google one': '#4285F4',
      'canva': '#00C4CC',
      'canva pro': '#00C4CC',
      'figma': '#F24E1E',
      'notion': '#000000',
      'jiosaavn': '#FF5722',
      'gaana': '#E91E63',
      'wynk music': '#E91E63',
      'wynk': '#E91E63',
      'sony liv': '#0F0F0F',
      'hulu': '#1CE783',
      'hbo': '#000000',
      'hbo max': '#0014FF',
      'paramount+': '#0064FF',
      'peacock': '#000000',
      'twitch': '#9146FF',
      'discord': '#5865F2',
      'slack': '#4A154B',
      'zoom': '#2D8CFF',
      'dropbox': '#0061FF',
      'icloud': '#3693F3',
      'onedrive': '#0078D4',
      'github': '#181717',
      'linkedin': '#0A66C2',
      'tidal': '#000000',
      'soundcloud': '#FF5500',
      'pandora': '#3668FF',
      'deezer': '#FF0092'
    };
    const key = name.toLowerCase().trim();
    return colors[key] || '#4f46e5';
  };

  const getDaysUntilRenewal = (renewalDate) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRenewalStatus = (days) => {
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'warning';
    return 'safe';
  };

  const totalCost = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.cost || 0), 0);
  const activeCount = subscriptions.length;
  const expiredCount = subscriptions.filter(sub => getDaysUntilRenewal(sub.renewalDate) < 0).length;

  if (currentPage === 'overview') {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Manage all your active subscriptions efficiently.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">In-active subscriptions.</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{expiredCount}</div>
            <div className="stat-label">Expired subscriptions.</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{subscriptions.filter(sub => getDaysUntilRenewal(sub.renewalDate) <= 30).length}</div>
            <div className="stat-label">Upcoming renewals.</div>
          </div>
        </div>

        <div className="subscriptions-section">
          <div className="section-header">
            <h2 className="section-title">Subscriptions Requiring Reminders</h2>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="subscriptions-grid">
              {subscriptions.slice(0, 4).map((subscription) => {
                const days = getDaysUntilRenewal(subscription.renewalDate);
                const status = getRenewalStatus(days);
                
                return (
                  <div key={subscription._id} className="subscription-card">
                    <div className="subscription-header">
                      <div 
                        className="subscription-icon" 
                        style={{ backgroundColor: getServiceColor(subscription.name) }}
                      >
                        {getServiceLogo(subscription.name) ? (
                          <img 
                            src={getServiceLogo(subscription.name)} 
                            alt={subscription.name}
                            style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
                            {subscription.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="subscription-name">{subscription.name}</div>
                        <div className="subscription-renewal">
                          {new Date(subscription.renewalDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="subscription-info">
                      <div className="subscription-cost">${subscription.cost}</div>
                      <div className="subscription-cycle">{subscription.billingCycle}</div>
                    </div>
                    <span className={`renewal-badge renewal-${status}`}>
                      {days > 0 ? `${days} days left` : 'Expired'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'subscriptions') {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage all your subscriptions in one place.</p>
        </div>

        <div className="section-header">
          <h2 className="section-title">All Subscriptions</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Subscription
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <div className="empty-title">No subscriptions found</div>
            <div className="empty-text">Start by adding your first subscription</div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Add Subscription
            </button>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {subscriptions.map((subscription) => {
              const days = getDaysUntilRenewal(subscription.renewalDate);
              const status = getRenewalStatus(days);
              
              return (
                <div key={subscription._id} className="subscription-card">
                  <div className="subscription-header">
                    <div 
                      className="subscription-icon" 
                      style={{ backgroundColor: getServiceColor(subscription.name) }}
                    >
                      {getServiceLogo(subscription.name) ? (
                        <img 
                          src={getServiceLogo(subscription.name)} 
                          alt={subscription.name}
                          style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                        />
                      ) : (
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
                          {subscription.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="subscription-name">{subscription.name}</div>
                      <div className="subscription-renewal">
                        {new Date(subscription.renewalDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="subscription-info">
                    <div className="subscription-cost">${subscription.cost}</div>
                    <div className="subscription-cycle">{subscription.billingCycle}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`renewal-badge renewal-${status}`}>
                      {days > 0 ? `${days} days left` : 'Expired'}
                    </span>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => deleteSubscription(subscription._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add Subscription</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Subscription Name</label>
                  <input
                    className="form-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Netflix"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cost ($)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="9.99"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Billing Cycle</label>
                  <select
                    className="form-input"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Renewal Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({...formData, renewalDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
        <p className="page-subtitle">Coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;