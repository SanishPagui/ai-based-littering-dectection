import cv2
from ultralytics import YOLO

model = YOLO('yolov5s.pt')

cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()

    if success:
        results = model(frame)

        annotated_frame = results[0].plot()

        image_np = cv2.resize(annotated_frame,(840,660))
        cv2.imshow("Litter Detection", image_np)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

cap.release()
cv2.destroyAllWindows()