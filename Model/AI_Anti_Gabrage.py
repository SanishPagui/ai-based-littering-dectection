import cv2
import mediapipe as mp
import numpy as np
from pathlib import Path
import time
from ultralytics import YOLO
import settings
import os

# Mediapipe utilities
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Output folder for saved frames
output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

# Counter state
curl_counter = 0
stage = None
drop_counter = 0

# Previous bottle Y-coordinate for drop detection
prev_bottle_y = None
drop_detected = False
drop_cooldown = 0

# Load YOLO model
model_path = Path(settings.DETECTION_MODEL)
model = YOLO(model_path)

# Unique filename generator
def get_unique_filename():
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    return os.path.join(output_dir, f"drop_detected_{timestamp}.jpg")

# Angle calculation
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return angle if angle <= 180 else 360 - angle

# Waste classification
def classify_waste_type(detected_items):
    recyclable_items = set(detected_items) & set(settings.RECYCLABLE)
    non_recyclable_items = set(detected_items) & set(settings.NON_RECYCLABLE)
    hazardous_items = set(detected_items) & set(settings.HAZARDOUS)
    return recyclable_items, non_recyclable_items, hazardous_items

def remove_dash_from_class_name(class_name):
    return class_name.replace("_", " ")

# Camera input
cap = cv2.VideoCapture(0)

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Camera error.")
            break

        frame = cv2.resize(frame, (640, 480))
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb.flags.writeable = False
        results = pose.process(rgb)
        rgb.flags.writeable = True
        image = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
            mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=3, circle_radius=1)
        )

        # Pose landmarks for curl counter
        try:
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                         landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                         landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                angle = calculate_angle(shoulder, elbow, wrist)
                cv2.putText(image, f"{int(angle)}°",
                            tuple(np.multiply(elbow, [640, 480]).astype(int)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                # Curl counter logic
                if angle > 160:
                    stage = "down"
                if angle < 30 and stage == "down":
                    stage = "up"
                    curl_counter += 1
        except Exception as e:
            print(f"[Pose] Error: {e}")

        # Object detection
        res = model.predict(image, conf=0.6)
        names = model.names
        detected_items = set()
        bottle_y = None

        for result in res:
            if hasattr(result, 'boxes') and hasattr(result.boxes, 'cls'):
                boxes = result.boxes.xyxy.cpu().numpy()
                classes = result.boxes.cls.cpu().numpy().astype(int)
                confidences = result.boxes.conf.cpu().numpy()

                for box, cls, conf in zip(boxes, classes, confidences):
                    x1, y1, x2, y2 = map(int, box)
                    label = f"{names[cls]}: {conf:.2f}"
                    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(image, label, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    class_name = names[cls]
                    detected_items.add(class_name)

                    if "bottle" in class_name.lower():
                        bottle_y = y2  # bottom of the bottle

        # Detect sharp bottle drop
        if drop_cooldown > 0:
            drop_cooldown -= 1

        if bottle_y and prev_bottle_y:
            delta_y = bottle_y - prev_bottle_y
            if delta_y > 80 and bottle_y > 400 and drop_cooldown == 0:
                drop_detected = True
                drop_counter += 1
                drop_cooldown = 30  # Prevent double counting (1 second at 30fps)
                print("[Drop] Bottle dropped sharply.")
                cv2.imwrite(get_unique_filename(), frame)

        prev_bottle_y = bottle_y

        # Waste type classification
        recyclable_items, non_recyclable_items, hazardous_items = classify_waste_type(detected_items)
        y_offset = 20
        for category, color in zip(
                [recyclable_items, non_recyclable_items, hazardous_items],
                [(0, 255, 0), (0, 0, 255), (255, 0, 0)]):
            for item in category:
                cv2.putText(image, f"{remove_dash_from_class_name(item)}", (10, y_offset),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                y_offset += 20

        # Display counters
        cv2.rectangle(image, (0, 0), (300, 80), (50, 50, 50), -1)
        cv2.putText(image, f"Curl Counter: {curl_counter}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
        cv2.putText(image, f"Drop Counter: {drop_counter}", (10, 65),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 150, 255), 2)

        # Show result
        cv2.imshow('Pose and Object Detection', image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
