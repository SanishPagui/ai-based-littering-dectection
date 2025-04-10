import cv2
import time
import os
from ultralytics import YOLO
import numpy as np
from collections import deque
import requests

# Load YOLO model
model = YOLO('yolov5su')  # Replace with 'litter.pt' if you have a custom-trained model

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
DROP_SPEED_THRESHOLD = 10  # Adjust the value as needed
MIN_FRAMES_BEFORE_DROP = 10  # Number of frames before considering a drop

def get_centroid(box):
    x1, y1, x2, y2 = box
    return int((x1 + x2) / 2), int((y1 + y2) / 2)

def match_centroids(current_centroids, tracked_objects):
    global next_object_id
    matches = {}

    used_current = set()  # Define the set used_current
    
    for curr_c in current_centroids:
        matched_id = None
        min_dist = 60  # max distance to consider same object

        best_match = None  # <--- Add this line here
        
        for obj_id, data in tracked_objects.items():
            if time.time() - data["cooldown"] < COOLDOWN_SECONDS:
                continue

            dist = np.linalg.norm(np.array(curr_c) - np.array(curr_c))  # <--- This also has a bug (see below)
            
            if dist < min_dist:
                min_dist = dist
                best_match = obj_id  # <-- fix this too

    
    # Create new objects for unmatched centroids
    for i, curr_c in enumerate(current_centroids):
        if i not in used_current:
            tracked_objects[next_object_id] = {
                "centroids": deque([curr_c], maxlen=MAX_HISTORY),
                "cooldown": 0,
                "last_seen": time.time(),
                "has_dropped": False,
                "drop_start_time": 0
            }
            matches[next_object_id] = curr_c
            next_object_id += 1
    
    return matches

def is_drop_motion(centroids_history, current_time, cooldown_time):
    # Check if we have enough history
    if len(centroids_history) < MIN_FRAMES_BEFORE_DROP:
        return False
    
    # Check cooldown
    if current_time - cooldown_time < COOLDOWN_SECONDS:
        return False
    
    # Get first part (earlier positions) and last part (recent positions)
    first_part = list(centroids_history)[:len(centroids_history)//2]
    last_part = list(centroids_history)[len(centroids_history)//2:]
    
    if len(first_part) < 2 or len(last_part) < 2:
        return False
    
    # Calculate average y positions
    early_avg_y = np.mean([c[1] for c in first_part])
    recent_avg_y = np.mean([c[1] for c in last_part])
    
    # Calculate vertical difference
    dy = recent_avg_y - early_avg_y
    
    # Check if the motion is primarily downward with minimal horizontal movement
    horizontal_movement = abs(np.mean([c[0] for c in last_part]) - np.mean([c[0] for c in first_part]))
    
    # Calculate the speed of the drop (pixels per second)
    time_span = max(0.1, len(centroids_history) / 30.0)  # estimate based on ~30fps
    drop_speed = dy / time_span
    
    # Return True if it's a downward motion exceeding thresholds
    is_drop = (dy > DROP_THRESHOLD and 
              horizontal_movement < dy * 0.6 and  # Even stricter horizontal constraint
              drop_speed > DROP_SPEED_THRESHOLD)
    
    return is_drop

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break
    
    current_time = time.time()
    
    results = model(frame, verbose=False)[0]
    filtered_boxes = []
    current_centroids = []
    
    # Filter ONLY for bottle objects (class 39 in COCO dataset)
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det
        if int(cls.item()) == 0:  # Litter class
            cx, cy = get_centroid((x1, y1, x2, y2))
            current_centroids.append((cx, cy))
            
            # Draw a red box with "Bottle" label for bottles
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
            cv2.putText(frame, "Bottle", (int(x1), int(y1) - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    
    matched = match_centroids(current_centroids, tracked_objects)
    
    # Update tracking data
    for obj_id, centroid in matched.items():
        obj = tracked_objects[obj_id]
        obj["centroids"].append(centroid)
        obj["last_seen"] = current_time
        
        # Check for drop motion
        if not obj["has_dropped"] and len(obj["centroids"]) >= MIN_FRAMES_BEFORE_DROP:
            if is_drop_motion(obj["centroids"], current_time, obj["cooldown"]):
                # Detected a drop
                drop_counter += 1
                dy = np.mean([c[1] for c in obj["centroids"]]) - obj["centroids"][0][1]
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

# Release resources
def upload_to_convex(image_path, timestamp):
    try:
        # Step 1: Get the upload URL from your Next.js API
        response = requests.get("https://hip-wolverine-698.convex.cloud")
        upload_url = response.json()["uploadUrl"]

        # Step 2: Upload the image to Convex file storage
        with open(image_path, "rb") as f:
            upload_response = requests.post(upload_url, files={"file": f})
            storage_id = upload_response.json()["storageId"]

        # Step 3: Call your SaveDroppedImage mutation
        save_data = {
            "image": storage_id,
            "timestamp": timestamp
        }
        r = requests.post("http://localhost:3000/api/save-dropped-image", json=save_data)
        print("Uploaded to Convex:", r.json())

    except Exception as e:
        print("Upload failed:", e)

cap.release()
cv2.destroyAllWindows()