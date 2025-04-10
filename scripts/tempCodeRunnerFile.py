# scripts/run.py

import cv2
import time
import datetime
import os
import numpy as np

# Create 'videos' directory if it doesn't exist
os.makedirs('videos', exist_ok=True)

# Load YOLOv4-tiny model
net = cv2.dnn.readNet("yolov4-tiny.weights", "yolov4-tiny.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]

# Load COCO class labels
with open("coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]

# ✅ Replace this with your actual video path
video_path = "videos/vid.mp4"
cap = cv2.VideoCapture(video_path)

# Get FPS and resolution
FPS = cap.get(cv2.CAP_PROP_FPS) or 20.0
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
frame_size = (frame_width, frame_height)

video_writer = None
recording = False
start_time = None
record_duration = 5  # seconds

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Video finished or error.")
        break

    height, width, _ = frame.shape
    blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)

    class_ids = []
    confidences = []
    boxes = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = int(np.argmax(scores))
            confidence = scores[class_id]
            if confidence > 0.5:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    detected = len(indexes) > 0

    if detected and not recording:
        now = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"videos/{now}.mp4"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video_writer = cv2.VideoWriter(filename, fourcc, FPS, frame_size)
        recording = True
        start_time = time.time()
        print(f"[INFO] Started recording: {filename}")

    if recording:
        video_writer.write(frame)
        if time.time() - start_time > record_duration:
            recording = False
            video_writer.release()
            print("[INFO] Finished recording.")

    for i in indexes.flatten():
        x, y, w, h = boxes[i]
        label = str(classes[class_ids[i]])
        confidence = confidences[i]
        color = (0, 255, 0)
        cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
        cv2.putText(frame, f"{label} {int(confidence * 100)}%", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    cv2.imshow("Detection", frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
if video_writer:
    video_writer.release()
cv2.destroyAllWindows()
