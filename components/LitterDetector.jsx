"use client";
import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const LitterDetector = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const [model, setModel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const saveVideoEvidence = useMutation(api.litter.saveVideoEvidence);

  useEffect(() => {
    cocoSsd.load().then(setModel);
  }, []);

  useEffect(() => {
    const detectLittering = async () => {
      if (
        model &&
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        !isRecording
      ) {
        const video = webcamRef.current.video;
        const predictions = await model.detect(video);

        const personDetected = predictions.some((p) => p.class === "person");
        const bottleDetected = predictions.some((p) =>
          ["bottle", "cup", "fork", "knife", "spoon"].includes(p.class)
        );

        if (personDetected && bottleDetected) {
          console.log("⚠️ Possible littering detected — recording...");
          startRecording();
        }
      }
    };

    const interval = setInterval(detectLittering, 3000);
    return () => clearInterval(interval);
  }, [model, isRecording]);

  const startRecording = () => {
    if (!webcamRef.current || isRecording) return;

    const stream = webcamRef.current.stream;
    recordedChunks.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });

      const base64Video = await blobToBase64(blob);

      await saveVideoEvidence({
        video: base64Video,
        timestamp: Date.now(),
      });

      console.log("✅ Video saved to database.");
      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    setTimeout(() => {
      mediaRecorderRef.current.stop();
    }, 5000); // 5s clip
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
        videoConstraints={{ facingMode: "user" }}
      />
      <p className="text-green-600 font-bold">
        {isRecording ? "Recording..." : "AI Monitoring Active"}
      </p>
    </div>
  );
};

export default LitterDetector;
