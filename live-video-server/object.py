# pi_stream_yolo.py
import cv2
import websocket
from ultralytics import YOLO
import numpy as np

# Load pretrained YOLO model (can be yolov5s.pt or your custom .pt)
model = YOLO("yolov5s.pt")  

# Connect to your WebSocket server
ws = websocket.WebSocket()
ws.connect("wss://live-video-serbot.onrender.com")

cap = cv2.VideoCapture(1)  # change 0/1/2 based on your camera

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Resize for faster processing
    frame_resized = cv2.resize(frame, (320, 240))

    # Run YOLO detection
    results = model.predict(frame_resized, verbose=False)

    # Draw bounding boxes on frame
    for r in results:
        for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
            x1, y1, x2, y2 = map(int, box)
            label = f"{model.names[int(cls)]} {conf:.2f}"
            cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (0,255,0), 2)
            cv2.putText(frame_resized, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1)

    # Encode frame as JPEG and send via WebSocket
    _, buffer = cv2.imencode('.jpg', frame_resized)
    ws.send(buffer.tobytes(), opcode=websocket.ABNF.OPCODE_BINARY)

cap.release()
ws.close()
