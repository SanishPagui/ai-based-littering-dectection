import cv2
import time
import datetime
import os
import torch

# Create 'videos' directory if it doesn't exist
os.makedirs('videos', exist_ok=True)

# Load YOLOv5 model (from Ultralytics hub)
model = torch.hub.load('ultralytics/yolov5', 'custom', path='models/best.pt', force_reload=True)
model.conf = 0.5  # Confidence threshold

# Path to video file
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

    # Convert to RGB for YOLOv5
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = model(img_rgb)
    detections = results.pandas().xyxy[0]

    # Check if any plastic litter is detected
    detected = False
    for _, row in detections.iterrows():
        label = row['name']
        if label == "plastic_litter":
            detected = True
            x1, y1, x2, y2 = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
            conf = row['confidence']
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Start recording if detection occurs
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

    cv2.imshow("Detection", frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
if video_writer:
    video_writer.release()
cv2.destroyAllWindows()
