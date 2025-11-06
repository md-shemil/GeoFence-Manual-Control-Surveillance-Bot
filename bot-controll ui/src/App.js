import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Import components
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import AlertsPanel from './components/AlertsPanel';
import GeofencingPanel from './components/GeofencingPanel';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const [videoUrl, setVideoUrl] = useState('wss://live-video-serbot.onrender.com'); // Default video stream URL
  const [activeTab, setActiveTab] = useState('control');
  const [videoStream, setVideoStream] = useState(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const videoWs = useRef(null);
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Alert 1' },
    { id: 2, message: 'Alert 2' }
  ]);
  const [geofenceSettings, setGeofenceSettings] = useState({
    enabled: true,
    radius: 100,
    center: { lat: 40.7128, lng: -74.0060 }
  });
  const ws = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection for vehicle control
    ws.current = new WebSocket("wss://bot-controll.onrender.com/ws");

    ws.current.onopen = () => {
      setStatus("Connected to backend");
      setIsConnected(true);
      ws.current.send(JSON.stringify({ type: "register", role: "frontend" }));
    };

    ws.current.onclose = () => {
      setStatus("Disconnected");
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status") {
        setStatus("Car status: " + data.state);
      }
    };

    // Initialize WebSocket connection for video stream
    if (videoUrl) {
      initializeVideoStream();
    }

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (videoWs.current) {
        videoWs.current.close();
      }
    };
  }, []);

  const initializeVideoStream = () => {
    if (videoWs.current) {
      videoWs.current.close();
    }

    videoWs.current = new WebSocket(videoUrl);
    videoWs.current.binaryType = "arraybuffer";

    videoWs.current.onopen = () => {
      console.log("Connected to video stream");
      setIsVideoConnected(true);
    };

    videoWs.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setVideoStream(imageUrl);
    };

    videoWs.current.onclose = () => {
      console.log("Disconnected from video stream");
      setIsVideoConnected(false);
    };

    videoWs.current.onerror = (err) => {
      console.error("Video WebSocket error:", err);
      setIsVideoConnected(false);
    };
  };

  useEffect(() => {
    if (videoUrl && videoUrl !== '') {
      initializeVideoStream();
    }
  }, [videoUrl]);

  const sendCommand = (action) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "command", action }));
      setStatus(`Sent command: ${action}`);
    }
  };

  const handleMouseDown = (action) => {
    if (action !== "stop") {
      sendCommand(action);
    }
  };

  const handleMouseUp = (action) => {
    if (action !== "stop") {
      sendCommand("stop");
    }
  };

  const handleTouchStart = (e, action) => {
    e.preventDefault();
    if (action !== "stop") {
      sendCommand(action);
    }
  };

  const handleTouchEnd = (e, action) => {
    e.preventDefault();
    if (action !== "stop") {
      sendCommand("stop");
    }
  };

  const handleStopClick = () => {
    sendCommand("stop");
  };


  // Fix Leaflet default markers
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);




  return (
    <div className="App">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        status={status}
      />

      <main className="main-content">
        {activeTab === 'control' && (
          <ControlPanel 
            videoStream={videoStream}
            isVideoConnected={isVideoConnected}
            videoUrl={videoUrl}
            isConnected={isConnected}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            handleStopClick={handleStopClick}
          />
        )}
        {activeTab === 'alerts' && (
          <AlertsPanel alerts={alerts} />
        )}
        {activeTab === 'geofencing' && (
          <GeofencingPanel 
            geofenceSettings={geofenceSettings}
            setGeofenceSettings={setGeofenceSettings}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPanel 
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
          />
        )}
      </main>
    </div>
  );
}

export default App;
