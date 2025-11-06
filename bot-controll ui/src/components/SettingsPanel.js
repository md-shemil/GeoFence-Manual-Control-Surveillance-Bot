import React from 'react';

const SettingsPanel = ({ videoUrl, setVideoUrl }) => {
  return (
    <div className="settings-panel">
      <h3>System Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label>Video Stream URL:</label>
          <input 
            type="text" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="wss://your-video-server.com"
          />
          <small>WebSocket URL for live video stream (e.g., wss://live-video-serbot.onrender.com)</small>
        </div>
        <div className="form-group">
          <label>WebSocket URL:</label>
          <input 
            type="text" 
            defaultValue="wss://bot-controll.onrender.com/ws"
            placeholder="Enter WebSocket URL"
          />
        </div>
        <div className="form-group">
          <label>Connection Timeout (seconds):</label>
          <input 
            type="number" 
            defaultValue="30"
            placeholder="30"
          />
        </div>
        <button className="save-button">Save Settings</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
