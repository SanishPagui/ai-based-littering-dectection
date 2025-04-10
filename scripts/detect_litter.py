# scripts/detect_litter.py
import torch
import cv2
import numpy as np

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='models/best.pt', force_reload=True)
model.conf = 0.5  # Confidence threshold

def detect(frame):
    # Convert to RGB
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Run detection
    results = model(img_rgb)

    # Parse results
    detections = results.pandas().xyxy[0]
    return detections
