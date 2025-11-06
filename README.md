# IntelliGuard-DualControlBot

## Overview
IntelliGuard-DualControlBot is an intelligent surveillance robot featuring dual-mode control with GPS-based geofencing and manual remote control. It uses a Raspberry Pi 5 running a YOLOv5 deep learning model for real-time weapon detection. The robot streams live video and sends instant alerts on weapon detection and geofence breaches to a web dashboard for enhanced security monitoring.

This project integrates a Raspberry Pi 5, ESP32 microcontroller, Neo6M GPS module, L298N motor driver, and a webcam, providing a powerful combination of edge AI and autonomous/mobile surveillance capabilities.

---

## Features
- Real-time weapon detection using YOLOv5 on Raspberry Pi
- Dual operation modes: 
  - Geo-fenced autonomous patrol within predefined GPS boundaries
  - Manual remote joystick-based control via web dashboard
- Live video streaming from robot camera to web dashboard
- Instant alert notifications on weapon detection and geofence violation
- Seamless communication between Raspberry Pi and ESP32 for motor and sensor control
- User-friendly web dashboard for monitoring and control

---

## Hardware Components
- Raspberry Pi 5 (main controller and video/AI processing)
- ESP32 microcontroller (motor control and sensor interfacing)
- Neo6M GPS module (location tracking and geofencing)
- L298N Motor Driver Module (DC motor control)
- DC Motors and Wheels
- USB Webcam (video streaming input)
- 3.7V Li-ion Battery Pack (power supply)
- Supporting electronics & wiring (battery management, voltage regulators)

---

## Software Stack
- Raspberry Pi OS (Linux-based)
- YOLOv5 (PyTorch) for weapon detection model
- Python 3 for backend scripts and communication
- Flask/Node.js (or your preferred framework) for web dashboard backend
- React.js (or plain HTML/JS) for frontend dashboard UI
- MQTT/WiFi or Serial UART for Pi ↔ ESP32 communication
- GPS NMEA data parsing for geofence logic

---

## Setup Instructions

### 1. Hardware Assembly
- Connect DC motors to L298N motor driver.
- Connect motor driver to ESP32 GPIO pins.
- Connect ESP32 to Raspberry Pi via UART or WiFi.
- Connect Neo6M GPS module to ESP32.
- Attach webcam to Raspberry Pi USB port.
- Power the system using 3.7V battery pack with appropriate voltage regulation.
- Assemble robot chassis and mount all components securely.

### 2. Software Installation on Raspberry Pi
