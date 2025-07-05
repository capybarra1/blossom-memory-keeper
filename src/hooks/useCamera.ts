
import { useState, useEffect, useRef } from "react";

interface UseCameraProps {
  enabled?: boolean;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  takePhoto: () => string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  error: string | null;
}

export const useCamera = ({ enabled = false }: UseCameraProps = {}): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
  };

  const takePhoto = (): string | null => {
    if (!videoRef.current || !isStreaming) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL("image/jpeg");
  };

  useEffect(() => {
    if (enabled) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [enabled]);

  return { videoRef, isStreaming, takePhoto, startCamera, stopCamera, error };
};
