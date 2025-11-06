import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isConnected, status }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Vehicle Control Dashboard</h1>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'control' ? 'active' : ''}`}
          onClick={() => setActiveTab('control')}
        >
          <span className="nav-icon">🎮</span>
          Control
        </button>
        <button 
          className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <span className="nav-icon">🚨</span>
          Alerts
        </button>
        <button 
          className={`nav-item ${activeTab === 'geofencing' ? 'active' : ''}`}
          onClick={() => setActiveTab('geofencing')}
        >
          <span className="nav-icon">📍</span>
          Geofencing
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">{status}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
