import cv2
import os
import numpy as np
import time
from datetime import datetime
from ultralytics import YOLO

# Load YOLO model - using a more accurate model and increasing confidence threshold
model = YOLO('yolov8n.pt')  # Using YOLOv8 nano instead of YOLOv5

# Create folders for output
os.makedirs("litter_clips", exist_ok=True)
os.makedirs("litter_images", exist_ok=True)

# Parameters
COMPARISON_INTERVAL = 5  # Time in seconds between frame comparisons
DETECTION_THRESHOLD = 0.35  # Lowered confidence threshold for detections
IOU_THRESHOLD = 0.3  # IoU threshold for considering same region

# Define classes that could be litter (not just limited to bottles)
LITTER_CLASSES = {
    0: 'person',  # For testing detection
    39: 'bottle',
    41: 'cup',
    44: 'bottle cap',
    76: 'scissors',
    77: 'teddy bear',
    84: 'book'
    # Add more classes as needed
}

def add_timestamp_to_image(image, text=None):
    """Add timestamp and optional text to image"""
    img_copy = image.copy()
    
    # Get current date and time
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Add timestamp at the bottom
    cv2.putText(img_copy, timestamp, (10, img_copy.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Add event text if provided
    if text:
        cv2.putText(img_copy, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    return img_copy

def calculate_iou(box1, box2):
    """Calculate IoU between two bounding boxes"""
    # Convert boxes to [x1, y1, x2, y2] format
    box1 = [int(box1[0]), int(box1[1]), int(box1[2]), int(box1[3])]
    box2 = [int(box2[0]), int(box2[1]), int(box2[2]), int(box2[3])]
    
    # Calculate intersection area
    x_left = max(box1[0], box2[0])
    y_top = max(box1[1], box2[1])
    x_right = min(box1[2], box2[2])
    y_bottom = min(box1[3], box2[3])
    
    if x_right < x_left or y_bottom < y_top:
        return 0.0
    
    intersection_area = (x_right - x_left) * (y_bottom - y_top)
    
    # Calculate union area
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union_area = box1_area + box2_area - intersection_area
    
    # Calculate IoU
    iou = intersection_area / union_area if union_area > 0 else 0
    
    return iou

def detect_litter(frame):
    """Detect potential litter objects in the frame and return bounding boxes"""
    results = model(frame, verbose=False)[0]
    litter_objects = []
    
    # Debug: Print all detections
    print("All detections:")
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det.tolist()
        cls_id = int(cls)
        print(f"Class: {cls_id}, Confidence: {conf:.2f}")
    
    for det in results.boxes.data:
        x1, y1, x2, y2, conf, cls = det.tolist()
        cls_id = int(cls)
        
        # Check if it's one of our monitored classes
        if cls_id in LITTER_CLASSES and conf > DETECTION_THRESHOLD:
            class_name = LITTER_CLASSES[cls_id]
            litter_objects.append([x1, y1, x2, y2, conf, cls_id, class_name])
            
    return litter_objects

def is_new_litter(current_objects, previous_objects):
    """Check if there are new litter objects in the current frame that weren't in the previous frame"""
    new_litter = []
    
    # For each current object, check if it matches any previous object
    for current_box in current_objects:
        is_new = True
        
        for prev_box in previous_objects:
            # Only compare if they're the same class
            if current_box[5] == prev_box[5]:
                iou = calculate_iou(current_box[:4], prev_box[:4])
                
                # If IoU is above threshold, it's the same object
                if iou > IOU_THRESHOLD:
                    is_new = False
                    break
                    
        if is_new:
            new_litter.append(current_box)
            
    return new_litter

def main():
    # Get input video file
    video_path = "C:/ai-based-littering-dectection/videos/tester3.mp4"
    
    # Open video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return
    
    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Video details: {width}x{height}, {fps} FPS, {total_frames} frames")
    
    # Calculate frames per comparison interval
    frames_per_interval = COMPARISON_INTERVAL * fps
    
    # Variables for frame comparison
    previous_frame = None
    previous_objects = []
    frame_count = 0
    litter_count = 0
    
    # Variables for storing video clip frames
    buffered_frames = []
    
    # Determine the video format based on OS
    if os.name == 'nt':  # Windows
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        video_ext = '.avi'
    else:  # Linux/Mac
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Changed to more compatible codec
        video_ext = '.mp4'
    
    # Process the first frame
    ret, first_frame = cap.read()
    if not ret:
        print("Failed to read first frame")
        return
    
    previous_frame = first_frame.copy()
    previous_objects = detect_litter(previous_frame)
    print(f"Initial detection found {len(previous_objects)} potential litter objects")
    
    # Debug display of initial detections
    debug_frame = previous_frame.copy()
    for obj in previous_objects:
        x1, y1, x2, y2, conf, cls_id, class_name = obj
        cv2.rectangle(debug_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(debug_frame, f"{class_name} {conf:.2f}", (int(x1), int(y1) - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    cv2.imshow("Initial Detections", cv2.resize(debug_frame, (840, 660)))
    cv2.waitKey(1000)  # Show for 1 second
    
    # Main loop
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Add current frame to buffer
        buffered_frames.append(frame.copy())
        frame_count += 1
        
        # Process every COMPARISON_INTERVAL * fps frames
        if frame_count % frames_per_interval == 0:
            print(f"\nProcessing frame {frame_count}/{total_frames} ({frame_count/total_frames*100:.1f}%)")
            
            # Detect litter objects in current frame
            current_objects = detect_litter(frame)
            print(f"Current frame detection found {len(current_objects)} potential litter objects")
            
            # Draw detections on current frame
            display_frame = frame.copy()
            for obj in current_objects:
                x1, y1, x2, y2, conf, cls_id, class_name = obj
                cv2.rectangle(display_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                cv2.putText(display_frame, f"{class_name} {conf:.2f}", (int(x1), int(y1) - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            
            # Check for new litter
            new_litter = is_new_litter(current_objects, previous_objects)
            print(f"Found {len(new_litter)} new litter objects")
            
            if new_litter:
                # Found new litter!
                litter_count += len(new_litter)
                print(f"[LITTER DETECTED] Found {len(new_litter)} new pieces of litter")
                
                # Generate unique timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                
                # Save annotated image
                litter_img = display_frame.copy()
                for obj in new_litter:
                    x1, y1, x2, y2, conf, cls_id, class_name = obj
                    cv2.rectangle(litter_img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 3)
                    cv2.putText(litter_img, f"NEW {class_name}", (int(x1), int(y1) - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                litter_text = f"Litter Detected - Count: {litter_count}"
                litter_img = add_timestamp_to_image(litter_img, litter_text)
                
                # Save image
                img_filename = f"litter_images/litter_{timestamp}.jpg"
                cv2.imwrite(img_filename, litter_img)
                print(f"Saved litter image: {img_filename}")
                
                # Save video clip if there are buffered frames
                if buffered_frames:
                    clip_filename = f"litter_clips/litter_clip_{timestamp}{video_ext}"
                    
                    # Ensure dimensions
                    frame_height, frame_width = buffered_frames[0].shape[:2]
                    
                    print(f"Creating video writer: {frame_width}x{frame_height}, FPS: {fps}")
                    out = cv2.VideoWriter(clip_filename, fourcc, fps, (frame_width, frame_height))
                    
                    # Check if writer opened correctly
                    if not out.isOpened():
                        print("ERROR: Could not create video writer")
                    else:
                        # Write all buffered frames to video
                        for f in buffered_frames:
                            out.write(f)
                        out.release()
                        print(f"Saved litter clip: {clip_filename}")
            
            # Update previous frame and detections
            previous_frame = frame.copy()
            previous_objects = current_objects
            
            # Clear buffer after saving clip to start fresh for next comparison
            buffered_frames = []
        
        # Keep buffer size limited to the current interval
        if len(buffered_frames) > frames_per_interval:
            buffered_frames.pop(0)
        
        # Display the frame with date/time and litter count
        info_frame = frame.copy()
        cv2.putText(info_frame, f"Litter Count: {litter_count}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (36, 0, 255), 2)
        cv2.putText(info_frame, f"Frame: {frame_count}/{total_frames}", (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (36, 0, 255), 2)
        cv2.putText(info_frame, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 
                    (info_frame.shape[1] - 230, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Resize for display
        resized = cv2.resize(info_frame, (840, 660))
        cv2.imshow("Litter Detection", resized)
        
        # Slow down display for better visualization (remove in production)
        if cv2.waitKey(10) & 0xFF == ord("q"):
            break
    
    # Clean up
    cap.release()
    cv2.destroyAllWindows()
    
    print(f"\nTotal litter detected: {litter_count}")
    print(f"Litter images saved in the 'litter_images' folder")
    print(f"Litter video clips saved in the 'litter_clips' folder")

if __name__ == "__main__":
    main()