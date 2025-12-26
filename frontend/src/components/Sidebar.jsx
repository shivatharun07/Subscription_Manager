const Sidebar = ({ currentPage, setCurrentPage, logout }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📱' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'reminders', label: 'Reminders', icon: '🔔' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>🚀 Subminder</h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
        <button onClick={logout} className="nav-item" style={{ color: '#ef4444' }}>
          <span className="nav-item-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;