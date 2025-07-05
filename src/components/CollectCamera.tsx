
import React, { useState, useEffect } from "react";
import { X, Info, Check, Leaf } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CollectCamera: React.FC = () => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [identified, setIdentified] = useState(false);
  const { videoRef, isStreaming, takePhoto, startCamera, stopCamera } = useCamera({ enabled: true });

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapturePhoto = () => {
    const photo = takePhoto();
    if (photo) {
      setCapturedPhoto(photo);
      stopCamera();
      simulateIdentification();
    }
  };

  const simulateIdentification = () => {
    setIdentifying(true);
    setTimeout(() => {
      setIdentifying(false);
      setIdentified(true);
    }, 2000);
  };

  const handleReset = () => {
    setCapturedPhoto(null);
    setIdentified(false);
    startCamera();
  };

  const renderIdentificationResult = () => {
    return (
      <div className="animate-fade-in">
        <div className="p-5 paper-card mb-4">
          <h3 className="text-xl font-semibold mb-2">Japanese Maple</h3>
          <p className="text-sm italic text-foreground/70 mb-3">Acer palmatum</p>
          
          <div className="flex gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-foreground/60 mb-1">Type</p>
              <p className="text-sm">Deciduous Tree</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-foreground/60 mb-1">Native to</p>
              <p className="text-sm">Japan, Korea, China</p>
            </div>
          </div>
          
          <p className="text-sm mb-4">
            Famous for its stunning autumn colors and delicate, deeply cut leaves.
          </p>
          
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white"
            onClick={handleReset}
          >
            <Leaf className="h-4 w-4 mr-2" />
            Add to Collection
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleReset}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
          >
            <Info className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center">
        {!capturedPhoto ? (
          <>
            {isStreaming ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg pointer-events-none"></div>
                
                {/* Simple instructional prompt */}
                <div className="absolute top-6 left-0 right-0 flex justify-center">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm max-w-[80%] text-center">
                    Take a clear photo of a leaf, flower, or plant to identify and collect it
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white hover:bg-white/90"
                    onClick={handleCapturePhoto}
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-accent" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-t-accent border-white border-opacity-20 rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full">
            <div className="relative w-full h-4/6">
              <img
                src={capturedPhoto}
                alt="Captured plant"
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {identifying && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-t-accent border-white border-opacity-20 rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-medium">Identifying plant...</p>
                </div>
              )}
            </div>
            
            <div className="p-4 h-2/6 overflow-y-auto">
              {identified ? (
                renderIdentificationResult()
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-center text-foreground/60">Processing image...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectCamera;
