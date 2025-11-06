import React from 'react';

const GeofencingPanel = ({ geofenceSettings, setGeofenceSettings }) => {
  return (
    <div className="geofencing-panel">
      <h3>Geofencing Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              checked={geofenceSettings.enabled}
              onChange={(e) => setGeofenceSettings({...geofenceSettings, enabled: e.target.checked})}
            />
            Enable Geofencing
          </label>
        </div>
        <div className="form-group">
          <label>Radius (meters):</label>
          <input 
            type="number" 
            value={geofenceSettings.radius}
            onChange={(e) => setGeofenceSettings({...geofenceSettings, radius: parseInt(e.target.value)})}
            disabled={!geofenceSettings.enabled}
          />
        </div>
        <div className="form-group">
          <label>Center Latitude:</label>
          <input 
            type="number" 
            value={geofenceSettings.center.lat}
            onChange={(e) => setGeofenceSettings({
              ...geofenceSettings, 
              center: {...geofenceSettings.center, lat: parseFloat(e.target.value)}
            })}
            disabled={!geofenceSettings.enabled}
          />
        </div>
        <div className="form-group">
          <label>Center Longitude:</label>
          <input 
            type="number" 
            value={geofenceSettings.center.lng}
            onChange={(e) => setGeofenceSettings({
              ...geofenceSettings, 
              center: {...geofenceSettings.center, lng: parseFloat(e.target.value)}
            })}
            disabled={!geofenceSettings.enabled}
          />
        </div>
        <button className="save-button">Save Settings</button>
      </div>
    </div>
  );
};

export default GeofencingPanel;
