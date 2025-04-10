import cv2
import time
import os
from ultralytics import YOLO
import numpy as np
from collections import deque
from datetime import datetime

# Load YOLO model
model = YOLO('yolov5s.pt')

# Create folder for dropped images
os.makedirs("dropped_images", exist_ok=True)

cap = cv2.VideoCapture(0)

# Object tracking
tracked_objects = {}  # id: {"centroids": deque, "cooldown": time, "last_seen": time, "has_dropped": bool}
next_object_id = 0
drop_counter = 0

# Parameters - adjusted with higher thresholds
DROP_THRESHOLD = 60  # Pixel threshold for vertical movement
COOLDOWN_SECONDS = 3
MAX_HISTORY = 10
MIN_FRAMES_BEFORE_DROP = 5
MAX_DISTANCE = 80
DROP_SPEED_THRESHOLD = 150

def add_timestamp_to_image(image, text=None):
    """Add timestamp and optional text to image"""
    img_copy = image.copy()
    
    # Get current date and time
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Add timestamp at the bottom
    cv2.putText(img_copy, timestamp, (10, img_copy.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Add drop event text if provided
    if text:
        cv2.putText(img_copy, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    return img_copy

def get_centroid(box):
    x1, y1, x2, y2 = box
    return int((x1 + x2) / 2), int((y1 + y2) / 2)

def match_centroids(current_centroids, tracked_objects):
    global next_object_id
    matches = {}
    used_current = set()
    
    # First, try to match with recently seen objects
    for obj_id, data in tracked_objects.items():
        if time.time() - data["last_seen"] > 1.0:  # Skip if not seen recently
            continue
            
        prev_c = data["centroids"][-1]
        best_match = None
        min_dist = MAX_DISTANCE
        
        for i, curr_c in enumerate(current_centroids):
            if i in used_current:
                continue
                
            dist = np.linalg.norm(np.array(curr_c) - np.array(prev_c))
            
            if dist < min_dist:
                min_dist = dist
                best_match = i
        
        if best_match is not None:
            matches[obj_id] = current_centroids[best_match]
            used_current.add(best_match)
    
    # Create new objects for unmatched centroids
    for i, curr_c in enumerate(current_centroids):
        if i not in used_current:
            tracked_objects[next_object_id] = {
                "centroids": deque([curr_c], maxlen=MAX_HISTORY),
                "cooldown": 0,
                "last_seen": time.time(),
                "has_dropped": False,
                "drop_start_time": 0,
                "frames_during_drop": []  # Store frames during drop motion
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
              horizontal_movement < dy * 0.6 and  # Stricter horizontal constraint
              drop_speed > DROP_SPEED_THRESHOLD)
    
    return is_drop

# Function to capture multiple frames during drop
def start_collecting_frames(obj):
    obj["collecting_frames"] = True
    obj["frames_during_drop"] = []  # Reset frames collection

def stop_collecting_frames(obj):
    obj["collecting_frames"] = False
    return obj["frames_during_drop"]

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break
    
    current_time = time.time()
    
    results = model(frame, verbose=False)[0]
    current_centroids = []
    
    # Filter ONLY for bottle objects (class 39 in COCO dataset)
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det.tolist()
        
        # Only consider bottles (class 39) with high confidence
        if int(cls) == 39 and conf > 0.7:  # Class 39 is bottle in COCO dataset
            cx, cy = get_centroid((int(x1), int(y1), int(x2), int(y2)))
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
        
        # If we're collecting frames for this object, store the current frame
        if obj.get("collecting_frames", False):
            # Store a copy of the frame with timestamp
            obj["frames_during_drop"].append((frame.copy(), current_time))
            
            # If we've collected enough frames or time has passed, process them
            drop_duration = current_time - obj.get("drop_start_time", current_time)
            if drop_duration > 1.0 or len(obj["frames_during_drop"]) > 15:
                frames = stop_collecting_frames(obj)
                
                # Choose the best frame (middle of the drop)
                if frames:
                    # For a single image, use the middle frame of the drop sequence
                    middle_idx = len(frames) // 2
                    best_frame, frame_time = frames[middle_idx]
                    
                    # Add timestamp and text to the image
                    drop_text = f"Drop #{drop_counter} - Bottle #{obj_id}"
                    timestamped_img = add_timestamp_to_image(best_frame, drop_text)
                    
                    # Save the timestamped image
                    timestamp = int(current_time)
                    filename = f"dropped_images/drop_{drop_counter}_{timestamp}.jpg"
                    cv2.imwrite(filename, timestamped_img)
                    print(f"[Drop {drop_counter}] Image saved as {filename}")
        
        # Check for drop motion
        if not obj["has_dropped"] and len(obj["centroids"]) >= MIN_FRAMES_BEFORE_DROP:
            if is_drop_motion(obj["centroids"], current_time, obj["cooldown"]):
                # Detected a drop
                drop_counter += 1
                print(f"[Drop {drop_counter}] by Bottle {obj_id} at {current_time:.2f}")
                
                # Start collecting frames for this drop event
                obj["drop_start_time"] = current_time
                start_collecting_frames(obj)
                
                # Update object state
                obj["cooldown"] = current_time
                obj["has_dropped"] = True
        
        # Reset drop flag after cooldown
        if obj["has_dropped"] and current_time - obj["cooldown"] > COOLDOWN_SECONDS:
            obj["has_dropped"] = False
    
    # Remove stale objects
    to_delete = [obj_id for obj_id, data in tracked_objects.items() 
                if current_time - data["last_seen"] > 1.5]
    for obj_id in to_delete:
        del tracked_objects[obj_id]
    
    # Draw tracking information for bottles
    for obj_id, data in tracked_objects.items():
        if current_time - data["last_seen"] < 1.0:
            # Get last known position
            cx, cy = data["centroids"][-1]
            
            # Draw circle at centroid
            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
            
            # Draw object ID
            cv2.putText(frame, f"Bottle:{obj_id}", (cx + 10, cy - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Draw trajectory (last few positions)
            points = list(data["centroids"])
            for i in range(1, len(points)):
                cv2.line(frame, points[i-1], points[i], (0, 255, 0), 2)
    
    # Display drop counter and current time on frame
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(frame, f"Bottles Dropped: {drop_counter}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (36, 0, 255), 2)
    cv2.putText(frame, current_datetime, (frame.shape[1] - 230, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    resized = cv2.resize(frame, (840, 660))
    cv2.imshow("Bottle Drop Detection", resized)
    
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

print(f"\nTotal drops detected: {drop_counter}")
print(f"Images saved in the 'dropped_images' folder")