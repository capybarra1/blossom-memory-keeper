import React, { useState } from "react";
import { Camera, X, Check, Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import scanImg from '@/asset/plants/11.png'

const examplePlant = {
  name: "Monstera",
  scientificName: "Monstera deliciosa",
  confidence: 96,
  description: "Monstera favours a warm, humid environment, making them ideal for indoors.",
  imageUrl: scanImg,
  careLevel: "Easy",
  light: "Medium to bright indirect light",
  water: "Allow soil to dry between waterings"
};

const PlantIdentification = () => {
  const navigate = useNavigate();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [collected, setCollected] = useState(false);

  const handleCapturePhoto = () => {
    setCapturedPhoto(scanImg);
    simulateIdentification();
  };

  const simulateIdentification = () => {
    setIdentifying(true);
    setTimeout(() => {
      setIdentifying(false);
      setIdentifiedPlant(examplePlant);
      setShowResult(true);
    }, 2000);
  };

  const handleReset = () => {
    setCapturedPhoto(null);
    setIdentifiedPlant(null);
    setShowResult(false);
    setCollected(false);
  };

  const handleCollect = () => {
    setCollected(true);
    setTimeout(() => { 
      navigate('/');
    }, 1500);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {!capturedPhoto ? (
            <>
              <div className="absolute top-4 left-4 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              {/* Full screen background image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                    src={scanImg}
                    alt="Plant camera view"
                    className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Scanning frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 border-2 border-white/80 rounded-3xl relative">
                  {/* Corner highlights */}
                  <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-3xl" />
                  <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-3xl" />
                  <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-3xl" />
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-3xl" />
                </div>
              </div>

              {/* Instruction text */}
              <div className="absolute top-16 left-4 right-4 flex justify-center z-10">
                <div className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm text-center max-w-sm">
                  Position a plant within the frame to identify it
                </div>
              </div>

              {/* Capture button */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                <Button
                    style={{backgroundColor:'#8fae96'}}
                    className="rounded-full w-20 h-20
                    border-4 border-white shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={handleCapturePhoto}
                >
                </Button>
              </div>
            </>
        ) : (
            <div className="absolute inset-0 w-full h-full">
              {/* Full screen captured image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                    src={capturedPhoto}
                    alt="Captured plant"
                    className="w-full h-full object-cover"
                />
              </div>

              {/* Control buttons */}
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 bg-black/40 text-white hover:bg-black/60 border-0 z-10"
                  onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 border-0 z-10"
                  onClick={handleReset}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Loading overlay */}
              {identifying && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-16 h-16 border-4 border-t-green-400 border-white/30 rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-medium text-lg">Identifying plant...</p>
                    <p className="text-white/80 text-sm mt-2">Analyzing leaf patterns and structure</p>
                  </div>
              )}

              {/* Results Dialog */}
              <Dialog open={showResult} onOpenChange={setShowResult} >
                <DialogContent className="sm:max-w-md rounded-xl p-4 bg-transparent overflow-hidden border-none shadow-xl"  >
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                          src={identifiedPlant?.imageUrl}
                          alt={identifiedPlant?.name}
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h2 className="text-2xl font-bold">{identifiedPlant?.name}</h2>
                        <p className="text-sm font-light italic">{identifiedPlant?.scientificName}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium py-1 px-3 rounded-full">
                        {identifiedPlant?.confidence}% Match
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-700 mb-4">{identifiedPlant?.description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-green-100 rounded-lg">
                          <p className="text-xs text-gray-600">Care</p>
                          <p className="text-sm font-medium">{identifiedPlant?.careLevel}</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-100 rounded-lg">
                          <p className="text-xs text-gray-600">Light</p>
                          <p className="text-sm font-medium">Medium</p>
                        </div>
                        <div className="text-center p-3 bg-orange-100 rounded-lg">
                          <p className="text-xs text-gray-600">Water</p>
                          <p className="text-sm font-medium">Moderate</p>
                        </div>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                              className="w-full bg-green-500 hover:bg-green-600 text-white group relative overflow-hidden"
                              onClick={collected ? undefined : handleCollect}
                              disabled={collected}
                          >
                            {collected ? (
                                <>
                                  <Check className="h-5 w-5 mr-2 animate-bounce" />
                                  Added to Collection
                                </>
                            ) : (
                                <>
                                  <Leaf className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                                  Collect This Plant
                                </>
                            )}
                          </Button>
                        </PopoverTrigger>
                        {/*<PopoverContent className="w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <div className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                              <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold">Plant Collected!</h3>
                            <p className="text-sm text-gray-600 mt-1">This plant has been added to your specimen book</p>
                          </div>
                        </PopoverContent>*/}
                      </Popover>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
        )}
      </div>
  );
};

export default PlantIdentification;