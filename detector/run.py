import cv2
import time
import os
from ultralytics import YOLO
import numpy as np
from collections import deque

# Load YOLO model
model = YOLO('yolov5s.pt')

# Create folder for dropped images
os.makedirs("dropped_images", exist_ok=True)

cap = cv2.VideoCapture(0)

# Object tracking
tracked_objects = {}  # id: {"centroids": deque, "cooldown": time, "last_seen": time}
next_object_id = 0
drop_counter = 0

# Parameters
DROP_THRESHOLD = 30  # Pixel threshold for vertical movement
COOLDOWN_SECONDS = 4
MAX_HISTORY = 6  # More history smooths detection

def get_centroid(box):
    x1, y1, x2, y2 = box
    return int((x1 + x2) / 2), int((y1 + y2) / 2)

def match_centroids(current_centroids, tracked_objects):
    global next_object_id
    matches = {}

    for curr_c in current_centroids:
        matched_id = None
        min_dist = 60  # max distance to consider same object

        for obj_id, data in tracked_objects.items():
            if time.time() - data["cooldown"] < COOLDOWN_SECONDS:
                continue

            prev_c = data["centroids"][-1]
            dist = np.linalg.norm(np.array(curr_c) - np.array(prev_c))

            if dist < min_dist:
                min_dist = dist
                matched_id = obj_id

        if matched_id is not None:
            matches[matched_id] = curr_c
        else:
            tracked_objects[next_object_id] = {
                "centroids": deque([curr_c], maxlen=MAX_HISTORY),
                "cooldown": 0,
                "last_seen": time.time()
            }
            matches[next_object_id] = curr_c
            next_object_id += 1

    return matches

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    results = model(frame, verbose=False)[0]
    current_centroids = []

    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det
        if int(cls.item()) == 0:  # Litter class
            cx, cy = get_centroid((x1, y1, x2, y2))
            current_centroids.append((cx, cy))

    matched = match_centroids(current_centroids, tracked_objects)

    for obj_id, centroid in matched.items():
        obj = tracked_objects[obj_id]
        obj["centroids"].append(centroid)
        obj["last_seen"] = time.time()

        if len(obj["centroids"]) >= MAX_HISTORY:
            early_avg_y = np.mean([c[1] for c in list(obj["centroids"])[:3]])
            recent_avg_y = np.mean([c[1] for c in list(obj["centroids"])[-3:]])
            dy = recent_avg_y - early_avg_y

            if dy > DROP_THRESHOLD and (time.time() - obj["cooldown"]) > COOLDOWN_SECONDS:
                drop_counter += 1
                print(f"[Drop {drop_counter}] by Object {obj_id} (Δy={dy:.1f})")

                timestamp = int(time.time())
                cv2.imwrite(f"dropped_images/drop_{timestamp}.jpg", frame)
                obj["cooldown"] = time.time()

    # Remove stale objects
    now = time.time()
    to_delete = [obj_id for obj_id, data in tracked_objects.items() if now - data["last_seen"] > 3]
    for obj_id in to_delete:
        del tracked_objects[obj_id]

    annotated_frame = results.plot()
    cv2.putText(annotated_frame, f"Drops Detected: {drop_counter}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (36, 0, 255), 2)

    resized = cv2.resize(annotated_frame, (840, 660))
    cv2.imshow("Litter Detection", resized)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
