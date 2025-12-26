import { useState, useEffect } from 'react';
import './App.css';
import { LandingPage } from './components/LandingPage';
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription as apiDeleteSubscription
} from './services/api';

const POPULAR_SERVICES = {
  // Streaming
  'Netflix': { logoUrl: '/logos/netflix.svg', category: 'Streaming', color: '#ee0808ff' },
  'Amazon Prime': { logoUrl: '/logos/amazon.svg', category: 'Streaming', color: '#00a8e1' },
  'Disney+ Hotstar': { logoUrl: '/logos/hotstar.svg', category: 'Streaming', color: '#1f80e0' },
  'YouTube Premium': { logoUrl: '/logos/youtube.svg', category: 'Streaming', color: '#ff0000' },
  'Sony LIV': { logoUrl: '/logos/sonyliv.svg', category: 'Streaming', color: '#08090aff' },
  'Zee5': { logoUrl: '/logos/zee5.svg', category: 'Streaming', color: '#6c5ce7' },
  'Voot': { logoUrl: '/logos/voot.svg', category: 'Streaming', color: '#ff6b35' },
  'MX Player': { logoUrl: '/logos/mxplayer.svg', category: 'Streaming', color: '#1aa0e3ff' },

  // Music
  'Spotify': { logoUrl: '/logos/spotify.svg', category: 'Music', color: '#1db954' },
  'Apple Music': { logoUrl: '/logos/apple.svg', category: 'Music', color: '#fa243c' },
  'YouTube Music': { logoUrl: '/logos/youtube.svg', category: 'Music', color: '#ff0000' },
  'JioSaavn': { logoUrl: '/logos/jiosaavn.svg', category: 'Music', color: '#28eecdff' },
  'Gaana': { logoUrl: '/logos/gaana.svg', category: 'Music', color: '#111010ff' },
  'Wynk Music': { logoUrl: '/logos/wynk.svg', category: 'Music', color: '#e74c3c' },

  // Productivity
  'Microsoft 365': { logoUrl: '/logos/microsoft.svg', category: 'Productivity', color: '#0078d4' },
  'Google Workspace': { logoUrl: '/logos/google.svg', category: 'Productivity', color: '#4285f4' },
  'Adobe Creative Cloud': { logoUrl: '/logos/adobe.svg', category: 'Productivity', color: '#ff0000' },
  'Canva Pro': { logoUrl: '/logos/canva.svg', category: 'Productivity', color: '#00c4cc' },
  'Notion': { logoUrl: '/logos/notion.svg', category: 'Productivity', color: '#000000' },
  'Figma': { logoUrl: '/logos/figma.svg', category: 'Productivity', color: '#f24e1e' }
};

const CATEGORIES = ['Streaming', 'Music', 'Productivity', 'Gaming', 'News', 'Education', 'Shopping', 'Food', 'Fitness', 'Health', 'Other'];

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState('landing');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billingCycle: 'Monthly',
    renewalDate: '',
    category: 'Streaming'
  });
  const [editingId, setEditingId] = useState(null);
  const [showExpired, setShowExpired] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Load user and subscriptions on mount
  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData.data);
          await fetchSubscriptions();
        } catch (err) {
          console.error('Failed to load user', err);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await getSubscriptions();
      const enrichedSubs = response.data.map(sub => {
        const service = POPULAR_SERVICES[sub.name];
        return {
          ...sub,
          logoUrl: service ? service.logoUrl : '',
          color: service ? service.color : '#4f46e5'
        };
      });
      setSubscriptions(enrichedSubs);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
      setError('Failed to load subscriptions');
    }
  };

  const login = async (userData) => {
    try {
      const loginResponse = await apiLogin(userData.email, userData.password);
      const userResponse = await getMe();
      setUser(userResponse.data);
      await fetchSubscriptions();
    } catch (err) {
      console.error('Login failed', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(message);
    }
  };

  const logout = () => {
    setUser(null);
    setSubscriptions([]);
    setShowRegister(false);
    localStorage.removeItem('token');
    setCurrentPage('overview');
  };

  const addSubscription = async (e) => {
    e.preventDefault();
    try {
      const service = POPULAR_SERVICES[formData.name] || { logoUrl: '', category: formData.category, color: '#4f46e5' };

      const subData = {
        name: formData.name,
        cost: parseFloat(formData.cost),
        billingCycle: formData.billingCycle,
        renewalDate: formData.renewalDate,
        startDate: new Date().toISOString(),
        category: service.category || formData.category
      };

      if (editingId) {
        const response = await updateSubscription(editingId, subData);
        const updatedSubs = subscriptions.map(sub =>
          sub._id === editingId ? { ...response.data, logoUrl: service.logoUrl, color: service.color } : sub
        );
        setSubscriptions(updatedSubs);
      } else {
        const response = await createSubscription(subData);
        const newSub = {
          ...response.data,
          logoUrl: service.logoUrl,
          color: service.color
        };
        setSubscriptions([...subscriptions, newSub]);
      }

      setFormData({ name: '', cost: '', billingCycle: 'Monthly', renewalDate: '', category: 'Streaming' });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save subscription', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to save subscription';
      alert(message);
    }
  };

  const handleEdit = (sub) => {
    setFormData({
      name: sub.name,
      cost: sub.cost,
      billingCycle: sub.billingCycle,
      renewalDate: sub.renewalDate.split('T')[0],
      category: sub.category
    });
    setEditingId(sub._id || sub.id);
    setShowModal(true);
  };

  const deleteSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await apiDeleteSubscription(id);
      const updatedSubs = subscriptions.filter(sub => sub._id !== id);
      setSubscriptions(updatedSubs);
    } catch (err) {
      console.error('Failed to delete subscription', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to delete subscription';
      alert(message);
    }
  };

  const getDaysUntilRenewal = (renewalDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(renewalDate);
    renewal.setHours(0, 0, 0, 0);
    const diffTime = renewal - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1d29', color: 'white' }}>Loading...</div>;
  }

  if (!user) {
    if (showRegister === 'register') {
      return <RegisterForm onRegister={async (data) => {
        try {
          const registerResponse = await apiRegister(data.name, data.email, data.password);
          const userResponse = await getMe();
          setUser(userResponse.data);
          await fetchSubscriptions();
        } catch (err) {
          console.error('Registration failed', err);
          const message = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
          alert(message);
        }
      }} setShowRegister={setShowRegister} />;
    }

    if (showRegister === 'login') {
      return <LoginForm onLogin={async (data) => {
        await login(data);
      }} setShowRegister={setShowRegister} />;
    }

    return <LandingPage
      onLogin={() => setShowRegister('login')}
      onRegister={() => setShowRegister('register')}
    />;
  }

  return (
    <div className="App">
      <div className="ambient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        logout={logout}
        user={user}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <main className="main-content">
        <Dashboard
          currentPage={currentPage}
          subscriptions={subscriptions}
          setSubscriptions={setSubscriptions}
          setShowModal={setShowModal}
          deleteSubscription={deleteSubscription}
          getDaysUntilRenewal={getDaysUntilRenewal}
          handleEdit={handleEdit}
          showExpired={showExpired}
          setShowExpired={setShowExpired}
        />
      </main>

      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', cost: '', billingCycle: 'Monthly', renewalDate: '', category: 'Streaming' });
          }}
          onSubmit={addSubscription}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingId}
        />
      )}
    </div>
  );
}

function LoginForm({ onLogin, setShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1d29'
    }}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
          <button onClick={() => setShowRegister('landing')} style={{ background: 'none', border: 'none', color: '#8b8d97', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <h2 className="modal-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #3a3d4a' }}>
          <p style={{ color: '#8b8d97', marginBottom: '10px' }}>Don't have an account?</p>
          <button onClick={() => setShowRegister('register')} className="btn btn-secondary">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onRegister, setShowRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ name, email, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1d29'
    }}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
          <button onClick={() => setShowRegister('landing')} style={{ background: 'none', border: 'none', color: '#8b8d97', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <h2 className="modal-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Account
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #3a3d4a' }}>
          <p style={{ color: '#8b8d97', marginBottom: '10px' }}>Already have an account?</p>
          <button onClick={() => setShowRegister('login')} className="btn btn-secondary">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

import { LayoutGrid, ListMusic, PieChart, Bell, LogOut, Rocket, User, Moon, Sun } from './components/Icons';

function Navbar({ currentPage, setCurrentPage, logout, user, toggleTheme, isDarkMode }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'subscriptions', label: 'Subscriptions', icon: ListMusic },
    { id: 'expenses', label: 'Expenses', icon: PieChart },
    { id: 'reminders', label: 'Reminders', icon: Bell }
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Rocket size={28} color="#6366f1" />
        <h1>Subminder</h1>
      </div>

      <nav className="navbar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={18} style={{ marginRight: '8px' }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="profile-section">
        <button
          className="profile-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <User size={20} />
          <span>{user?.name || 'User'}</span>
        </button>

        {showDropdown && (
          <div className="profile-dropdown">
            <div style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '5px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)' }}>{user?.email}</p>
            </div>

            <button className="dropdown-item" onClick={() => { toggleTheme(); setShowDropdown(false); }}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="dropdown-divider"></div>

            <button className="dropdown-item" onClick={logout} style={{ color: '#ef4444' }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function Dashboard({ currentPage, subscriptions, setSubscriptions, setShowModal, deleteSubscription, getDaysUntilRenewal, handleEdit, showExpired, setShowExpired }) {
  const [showUrgentAlert, setShowUrgentAlert] = useState(true);

  // Filter subscriptions into different buckets
  const dueOrOverdue = subscriptions.filter(sub => getDaysUntilRenewal(sub.renewalDate) <= 0);
  const expiringSoon = subscriptions.filter(sub => {
    const days = getDaysUntilRenewal(sub.renewalDate);
    return days > 0 && days <= 2;
  });

  const totalCost = subscriptions.reduce((sum, sub) => {
    const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    return sum + monthlyCost;
  }, 0);

  const upcomingRenewalsCount = subscriptions.filter(sub => {
    const days = getDaysUntilRenewal(sub.renewalDate);
    return days <= 30; // Count all due/overdue and upcoming within 30 days
  }).length;

  const handleRenewedConfirm = async (sub) => {
    try {
      // Calculate next date from the current renewal date, not from today
      // This ensures we don't drift if the user marks it late
      const nextDate = new Date(sub.renewalDate);
      if (sub.billingCycle.toLowerCase() === 'yearly') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      const updatedData = { ...sub, renewalDate: nextDate.toISOString() };
      const response = await updateSubscription(sub._id, updatedData);

      // Update local state
      const updatedSubs = subscriptions.map(s => s._id === sub._id ? { ...s, renewalDate: response.data.renewalDate } : s);
      setSubscriptions(updatedSubs);
      alert(`${sub.name} renewed! Next date: ${new Date(response.data.renewalDate).toLocaleDateString()}`);
    } catch (err) {
      console.error('Failed to renew subscription', err);
      alert('Failed to update renewal date.');
    }
  };

  const expensesByCategory = subscriptions.reduce((acc, sub) => {
    const cost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    acc[sub.category] = (acc[sub.category] || 0) + cost;
    return acc;
  }, {});

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  const maxCategoryCost = Math.max(...categoryData.map(d => d.value), 100);

  const getCategoryColor = (cat) => {
    const colors = {
      'Entertainment': '#ec4899', // Pink
      'Utilities': '#3b82f6', // Blue
      'Productivity': '#10b981', // Emerald
      'Streaming': '#f43f5e', // Rose
      'Software': '#8b5cf6', // Violet
      'Other': '#64748b' // Slate
    };
    return colors[cat] || '#6366f1';
  };

  useEffect(() => {
    const handleMouseMove = e => {
      for (const card of document.getElementsByClassName("stat-card")) {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (currentPage === 'dashboard' || currentPage === 'overview') {
    return (
      <div className="dashboard-container fade-in">
        {(dueOrOverdue.length > 0 || expiringSoon.length > 0) && showUrgentAlert && (
          <div className="urgent-alert-banner">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div className="alert-text">
                {dueOrOverdue.length > 0 && (
                  <div className="today-alert">
                    <strong>Due or Overdue:</strong> {dueOrOverdue.map(s => s.name).join(', ')}
                    {dueOrOverdue.length === 1 && (
                      <button className="renew-action-btn" onClick={() => handleRenewedConfirm(dueOrOverdue[0])}>
                        Mark as Renewed
                      </button>
                    )}
                  </div>
                )}
                {expiringSoon.length > 0 && (
                  <div className="soon-alert" style={{ marginTop: dueOrOverdue.length > 0 ? '8px' : '0' }}>
                    <strong>Renewing Soon:</strong> {expiringSoon.length === 1
                      ? `${expiringSoon[0].name} in ${getDaysUntilRenewal(expiringSoon[0].renewalDate)} days!`
                      : `${expiringSoon.length} services within 2 days!`}
                  </div>
                )}
              </div>
            </div>
            <button className="alert-close-btn" onClick={() => setShowUrgentAlert(false)} aria-label="Dismiss alert">
              ×
            </button>
          </div>
        )}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's your subscription summary.</p>
          </div>
          <button className="btn btn-primary pulse-animation" onClick={() => setShowModal(true)}>
            + Add New
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card gradient-1 pop-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon-bg">📊</div>
            <div>
              <div className="stat-number">{subscriptions.length}</div>
              <div className="stat-label">Active Subscriptions</div>
            </div>
          </div>
          <div className="stat-card gradient-2 pop-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon-bg">💰</div>
            <div>
              <div className="stat-number">₹{totalCost.toFixed(2)}</div>
              <div className="stat-label">Total Monthly Cost</div>
            </div>
          </div>
          <div className="stat-card gradient-3 pop-in" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon-bg">🔔</div>
            <div>
              <div className="stat-number">{upcomingRenewalsCount}</div>
              <div className="stat-label">Upcoming Renewals</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="main-chart-section">
            <h2 className="section-title">Expenses by Category</h2>
            <div className="chart-container">
              {categoryData.length === 0 ? (
                <div className="empty-chart">No data to display</div>
              ) : (
                <div className="bar-chart-real">
                  {categoryData.map((data, index) => (
                    <div key={data.name} className="bar-wrapper" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                      <div
                        className="bar-real grow-height"
                        style={{
                          height: `${(data.value / maxCategoryCost) * 100}%`,
                          backgroundColor: getCategoryColor(data.name),
                          animationDelay: `${0.4 + index * 0.1}s`
                        }}
                      >
                        <div className="tooltip">₹{data.value.toFixed(0)}</div>
                      </div>
                      <span className="bar-label">{data.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="recent-activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {subscriptions.slice(0, 3).map((sub, index) => (
                <div key={sub._id} className="activity-item slide-in-right" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="activity-icon" style={{ backgroundColor: sub.color }}>
                    {sub.name.charAt(0)}
                  </div>
                  <div className="activity-details">
                    <span className="name">{sub.name}</span>
                    <span className="desc">Renews {new Date(sub.renewalDate).toLocaleDateString()}</span>
                  </div>
                  <span className="price">₹{sub.cost}</span>
                </div>
              ))}
              {subscriptions.length === 0 && <p className="text-secondary">No recent activity</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'subscriptions') {
    const expiredSubs = subscriptions.filter(sub => getDaysUntilRenewal(sub.renewalDate) < 0);
    const activeSubs = subscriptions.filter(sub => getDaysUntilRenewal(sub.renewalDate) >= 0);
    const displayedSubs = showExpired ? subscriptions : activeSubs;

    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage all your subscriptions in one place.</p>
        </div>
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 className="section-title">All Subscriptions</h2>
            {expiredSubs.length > 0 && (
              <button
                className={`btn ${showExpired ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '14px' }}
                onClick={() => setShowExpired(!showExpired)}
              >
                {showExpired ? 'Hide Expired' : `Show Expired (${expiredSubs.length})`}
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Subscription
          </button>
        </div>

        {displayedSubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <div className="empty-title">No subscriptions found</div>
            <div className="empty-text">
              {showExpired ? 'You have no subscriptions at all.' : 'Start by adding your first subscription or check expired ones.'}
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Add Subscription
            </button>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {displayedSubs.map((sub) => (
              <SubscriptionCard
                key={sub._id || sub.id}
                sub={sub}
                deleteSubscription={deleteSubscription}
                handleEdit={handleEdit}
                getDaysUntilRenewal={getDaysUntilRenewal}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'expenses') {
    const monthlyExpenses = subscriptions.reduce((acc, sub) => {
      const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
      return acc;
    }, {});

    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track your subscription expenses by category.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">₹{totalCost.toFixed(2)}</div>
            <div className="stat-label">Monthly Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">₹{(totalCost * 12).toFixed(2)}</div>
            <div className="stat-label">Yearly Total</div>
          </div>
        </div>

        {Object.keys(monthlyExpenses).length > 0 && (
          <div className="subscriptions-section">
            <h2 className="section-title">Expenses by Category</h2>
            <div className="subscriptions-grid">
              {Object.entries(monthlyExpenses).map(([category, amount]) => (
                <div key={category} className="stat-card">
                  <div className="stat-number">₹{amount.toFixed(2)}</div>
                  <div className="stat-label">{category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'reminders') {
    const upcomingSubs = subscriptions.filter(sub => {
      const days = getDaysUntilRenewal(sub.renewalDate);
      return days <= 30 && days > 0;
    });

    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">Stay on top of your upcoming renewals.</p>
        </div>

        {upcomingSubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <div className="empty-title">No upcoming renewals</div>
            <div className="empty-text">All your subscriptions are up to date!</div>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {upcomingSubs.map((sub) => (
              <SubscriptionCard key={sub._id || sub.id} sub={sub} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

function SubscriptionCard({ sub, deleteSubscription, handleEdit, getDaysUntilRenewal }) {
  const days = getDaysUntilRenewal ? getDaysUntilRenewal(sub.renewalDate) : 1;
  const isExpired = days < 0;

  return (
    <div className={`subscription-card fade-in ${isExpired ? 'expired-card' : ''}`} style={{ opacity: isExpired ? 0.8 : 1 }}>
      {handleEdit && (
        <button
          className="edit-btn"
          onClick={() => handleEdit(sub)}
          title="Modify Subscription"
        >
          ✎
        </button>
      )}
      {deleteSubscription && (
        <button
          className="delete-btn"
          onClick={() => deleteSubscription(sub._id || sub.id)}
          title="Delete Subscription"
        >
          ×
        </button>
      )}
      <div className="subscription-header">
        <div
          className="subscription-icon"
          style={{
            backgroundColor: sub.color,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {sub.logoUrl ? (
            <img
              src={sub.logoUrl}
              alt={sub.name}
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px' }}>
              {sub.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="subscription-meta">
          <div className="subscription-name">{sub.name}</div>
          <div className="subscription-renewal">
            {new Date(sub.renewalDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="subscription-info-body">
        <p className="subscription-note">
          Prepare for renewals to avoid interruptions. Renew subscriptions on time.
        </p>
      </div>

      <div className="subscription-footer">
        <div className="cost-info">
          <span className="label">Monthly Cost</span>
          <span className="value">₹{sub.cost}</span>
        </div>
        <span className={`renewal-badge ${isExpired ? 'renewal-warning' : 'renewal-urgent'}`}>
          {isExpired ? 'Expired' : 'Active'}
        </span>
      </div>
    </div>
  );
}

function Modal({ onClose, onSubmit, formData, setFormData, isEditing }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Modify Subscription' : 'Add Subscription'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Subscription Service</label>
            <select
              className="form-input"
              value={POPULAR_SERVICES[formData.name] || formData.name === '' ? formData.name : 'Custom'}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === 'Custom') {
                  setFormData({ ...formData, name: 'Custom' });
                } else if (selectedValue === '') {
                  setFormData({ ...formData, name: '' });
                } else {
                  const service = POPULAR_SERVICES[selectedValue];
                  setFormData({
                    ...formData,
                    name: selectedValue,
                    category: service ? service.category : formData.category
                  });
                }
              }}
              required
            >
              <option value="">Select a service</option>
              {Object.keys(POPULAR_SERVICES).map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
              <option value="Custom">Custom Service</option>
            </select>
          </div>

          {formData.name !== '' && !POPULAR_SERVICES[formData.name] && (
            <div className="form-group fade-in">
              <label className="form-label">Service Name</label>
              <input
                className="form-input"
                type="text"
                value={formData.name === 'Custom' ? '' : formData.name}
                placeholder="Enter service name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cost (₹)</label>
            <input
              className="form-input"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="199.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Billing Cycle</label>
            <select
              className="form-input"
              value={formData.billingCycle}
              onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Renewal Date</label>
            <input
              className="form-input"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;