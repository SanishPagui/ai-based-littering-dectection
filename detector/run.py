import cv2
import os
import numpy as np
import time
import threading
from datetime import datetime
from ultralytics import YOLO
from flask import Flask, jsonify

# ---------------------------
# Global variables & settings
# ---------------------------
# Global litter count (will be updated during video processing)
global_litter_count = 0

# Create folders for output
os.makedirs("litter_clips", exist_ok=True)
os.makedirs("litter_images", exist_ok=True)

# Parameters
COMPARISON_INTERVAL = 5  # seconds
DETECTION_THRESHOLD = 0.35
IOU_THRESHOLD = 0.3

# Define classes that might be litter
LITTER_CLASSES = {
    0: 'person',
    39: 'bottle',
     41: 'cup',
    84: 'book'
}

# Load YOLO model
model = YOLO('yolov8n.pt')

# ---------------------------
# Utility functions
# ---------------------------
def add_timestamp_to_image(image, text=None):
    img_copy = image.copy()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(img_copy, timestamp, (10, img_copy.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    if text:
        cv2.putText(img_copy, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    return img_copy

def calculate_iou(box1, box2):
    box1 = [int(box1[0]), int(box1[1]), int(box1[2]), int(box1[3])]
    box2 = [int(box2[0]), int(box2[1]), int(box2[2]), int(box2[3])]
    x_left = max(box1[0], box2[0])
    y_top = max(box1[1], box2[1])
    x_right = min(box1[2], box2[2])
    y_bottom = min(box1[3], box2[3])
    if x_right < x_left or y_bottom < y_top:
        return 0.0
    intersection_area = (x_right - x_left) * (y_bottom - y_top)
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union_area = box1_area + box2_area - intersection_area
    iou = intersection_area / union_area if union_area > 0 else 0
    return iou

def detect_litter(frame):
    results = model(frame, verbose=False)[0]
    litter_objects = []
    print("All detections:")
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det.tolist()
        cls_id = int(cls)
        print(f"Class: {cls_id}, Confidence: {conf:.2f}")
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det.tolist()
        cls_id = int(cls)
        if cls_id in LITTER_CLASSES and conf > DETECTION_THRESHOLD:
            class_name = LITTER_CLASSES[cls_id]
            litter_objects.append([x1, y1, x2, y2, conf, cls_id, class_name])
    return litter_objects

def is_new_litter(current_objects, previous_objects):
    new_litter = []
    for current_box in current_objects:
        is_new = True
        for prev_box in previous_objects:
            if current_box[5] == prev_box[5]:
                iou = calculate_iou(current_box[:4], prev_box[:4])
                if iou > IOU_THRESHOLD:
                    is_new = False
                    break
        if is_new:
            new_litter.append(current_box)
    return new_litter

# ---------------------------
# Video processing function
# ---------------------------
def process_video(video_path):
    global global_litter_count
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return
    
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video details: {fps} FPS, {total_frames} frames")
    
    frames_per_interval = COMPARISON_INTERVAL * fps
    previous_frame = None
    previous_objects = []
    frame_count = 0
    local_litter_count = 0
    buffered_frames = []
    
    # Set video writer codec and extension depending on OS
    if os.name == 'nt':
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        video_ext = '.avi'
    else:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video_ext = '.mp4'
    
    ret, first_frame = cap.read()
    if not ret:
        print("Failed to read first frame")
        return
    
    previous_frame = first_frame.copy()
    previous_objects = detect_litter(previous_frame)
    print(f"Initial detection found {len(previous_objects)} potential litter objects")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        buffered_frames.append(frame.copy())
        frame_count += 1
        
        if frame_count % frames_per_interval == 0:
            print(f"\nProcessing frame {frame_count}/{total_frames} ({frame_count/total_frames*100:.1f}%)")
            current_objects = detect_litter(frame)
            print(f"Current frame detection found {len(current_objects)} potential litter objects")
            display_frame = frame.copy()
            for obj in current_objects:
                x1, y1, x2, y2, conf, cls_id, class_name = obj
                cv2.rectangle(display_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                cv2.putText(display_frame, f"{class_name} {conf:.2f}", (int(x1), int(y1) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            
            new_litter = is_new_litter(current_objects, previous_objects)
            print(f"Found {len(new_litter)} new litter objects")
            if new_litter:
                local_litter_count += len(new_litter)
                print(f"[LITTER DETECTED] Found {len(new_litter)} new pieces of litter")
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                litter_img = display_frame.copy()
                for obj in new_litter:
                    x1, y1, x2, y2, conf, cls_id, class_name = obj
                    cv2.rectangle(litter_img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 3)
                    cv2.putText(litter_img, f"NEW {class_name}", (int(x1), int(y1) - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                litter_text = f"Litter Detected - Count: {local_litter_count}"
                litter_img = add_timestamp_to_image(litter_img, litter_text)
                img_filename = f"litter_images/litter_{timestamp}.jpg"
                cv2.imwrite(img_filename, litter_img)
                print(f"Saved litter image: {img_filename}")
                if buffered_frames:
                    clip_filename = f"litter_clips/litter_clip_{timestamp}{video_ext}"
                    frame_height, frame_width = buffered_frames[0].shape[:2]
                    print(f"Creating video writer: {frame_width}x{frame_height}, FPS: {fps}")
                    out = cv2.VideoWriter(clip_filename, fourcc, fps, (frame_width, frame_height))
                    if not out.isOpened():
                        print("ERROR: Could not create video writer")
                    else:
                        for f in buffered_frames:
                            out.write(f)
                        out.release()
                        print(f"Saved litter clip: {clip_filename}")
            previous_frame = frame.copy()
            previous_objects = current_objects
            buffered_frames = []
        
        if len(buffered_frames) > frames_per_interval:
            buffered_frames.pop(0)
        
        # (Optional) Display current frame
        cv2.imshow("Litter Detection", cv2.resize(frame, (840, 660)))
        if cv2.waitKey(10) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()
    
    print(f"\nTotal litter detected: {local_litter_count}")
    # Update the global counter for access via Flask
    global global_litter_count
    global_litter_count = local_litter_count
    return local_litter_count

# ---------------------------
# Flask App Definition
# ---------------------------
app = Flask(__name__)

@app.route('/litter_count', methods=['GET'])
def get_litter_count():
    # Return the current litter count in JSON format
    return jsonify({'litter_count': global_litter_count})

# ---------------------------
# Main
# ---------------------------
if __name__ == "__main__":
    # Get video file path from user input or define it here
    video_path = input("Enter path to video file: ").strip()
    
    # Run the video processing in a separate thread
    detection_thread = threading.Thread(target=process_video, args=(video_path,))
    detection_thread.start()
    
    # Run Flask so that the Next.js frontend can fetch the litter count
    # Flask will run on http://0.0.0.0:5000 by default
    app.run(debug=True, host='0.0.0.0', port=5000)
