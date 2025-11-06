import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients (frontend + car)
let clients = {
  frontend: null,
  car: null,
};

// Store latest GPS point
let latestGPS = {
  lat: null,
  lng: null,
  timestamp: null,
};

wss.on("connection", (ws, req) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // Identify client role
      if (data.type === "register") {
        if (data.role === "frontend") {
          clients.frontend = ws;
          console.log("Frontend registered");
        } else if (data.role === "car") {
          clients.car = ws;
          console.log("Car registered");
        }
      }

      // Handle control commands (frontend → car)
      if (data.type === "command" && clients.car) {
        console.log(`Command from frontend: ${data.action}`);
        clients.car.send(JSON.stringify({ type: "command", action: data.action }));
      }

      // Handle car status (car → frontend)
      if (data.type === "status" && clients.frontend) {
        console.log(`Car status: ${data.state}`);
        clients.frontend.send(JSON.stringify({ type: "status", state: data.state }));
      }

      // Handle GPS data (car → server)
      if (data.type === "gps") {
        latestGPS = {
          lat: data.lat,
          lng: data.lng,
          timestamp: Date.now(),
        };
        console.log(`📍 Updated GPS: ${data.lat}, ${data.lng}`);

        // Forward to frontend if connected
        if (clients.frontend) {
          clients.frontend.send(JSON.stringify({
            type: "gps",
            lat: data.lat,
            lng: data.lng,
            timestamp: latestGPS.timestamp,
          }));
        }
      }

    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (clients.frontend === ws) clients.frontend = null;
    if (clients.car === ws) clients.car = null;
  });
});

// =========================
// ✅ REST API ENDPOINTS
// =========================

// Root route
app.get("/", (req, res) => {
  res.send("Car Control Backend is running 🚗💨");
});

// Get latest GPS location
app.get("/gps", (req, res) => {
  if (latestGPS.lat && latestGPS.lng) {
    res.json({
      success: true,
      ...latestGPS,
    });
  } else {
    res.status(404).json({ success: false, message: "No GPS data available" });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
