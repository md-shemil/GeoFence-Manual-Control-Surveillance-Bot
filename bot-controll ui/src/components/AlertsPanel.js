import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const AlertsPanel = ({ alerts }) => {
  return (
    <div className="alerts-panel">
      <h3>System Alerts & Location Map</h3>
      
      <div className="map-section">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={12}
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      <div className="alerts-list">
        <h4>Recent Alerts</h4>
        {alerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <div className="alert-content">
              <span className="alert-message">{alert.message}</span>
            </div>
            <button className="alert-dismiss">×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
