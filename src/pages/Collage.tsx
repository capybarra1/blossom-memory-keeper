import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Save, Share2, Trash2, Plus, X, Image, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dummyPlants, Plant } from "@/lib/dummyData";
import PlantCard from "@/components/PlantCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import html2canvas from "html2canvas";

interface BackgroundOption {
  id: string;
  name: string;
  type: 'texture' | 'frame';
  style: string;
  preview: string;
}

interface StickerProps {
  plant: Plant;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  zIndex: number;
  onSelect: () => void;
  selected: boolean;
  onMove: (newPosition: { x: number; y: number }) => void;
  onRotate: (angle: number) => void;
  onResize: (scale: number) => void;
  onDelete: () => void;
}

interface SavedCollage {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  stickers: Array<{
    id: string;
    plant: Plant;
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    zIndex: number;
  }>;
  background: BackgroundOption;
}

const PlantSticker: React.FC<StickerProps> = ({
  plant,
  position,
  rotation,
  scale,
  zIndex,
  onSelect,
  selected,
  onMove,
  onRotate,
  onResize,
  onDelete
}) => {
  const stickerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  
  // Touch gesture states
  const [initialTouchDistance, setInitialTouchDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState<number>(scale);
  const [initialRotation, setInitialRotation] = useState<number>(rotation);
  const [lastTouchAngle, setLastTouchAngle] = useState<number | null>(null);

  // Mouse wheel for scaling
  const handleWheel = (e: React.WheelEvent) => {
    if (!selected) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(3, scale + delta));
    onResize(newScale);
  };

  // Mouse drag with modifier keys for rotation and scaling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (e.shiftKey) {
      // Shift + drag for rotation
      const rect = stickerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        setLastTouchAngle(initialAngle);
        setInitialRotation(rotation);
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + drag for scaling
      setInitialScale(scale);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      // Normal drag for moving
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart && lastTouchAngle === null) return;
    
    if (e.shiftKey && lastTouchAngle !== null) {
      // Rotation
      const rect = stickerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        const angleDiff = currentAngle - lastTouchAngle;
        onRotate(initialRotation + angleDiff);
      }
    } else if ((e.ctrlKey || e.metaKey) && dragStart) {
      // Scaling
      const deltaY = e.clientY - dragStart.y;
      const scaleFactor = 1 + (deltaY * 0.01);
      const newScale = Math.max(0.3, Math.min(3, initialScale * scaleFactor));
      onResize(newScale);
    } else if (dragStart && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Moving
      onMove({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setDragStart({ 
        x: touch.clientX - position.x, 
        y: touch.clientY - position.y 
      });
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      setInitialTouchDistance(distance);
      setInitialScale(scale);
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      
      setLastTouchAngle(angle);
      setInitialRotation(rotation);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.touches.length === 1 && dragStart) {
      const touch = e.touches[0];
      onMove({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && initialTouchDistance !== null && lastTouchAngle !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleFactor = distance / initialTouchDistance;
      onResize(Math.max(0.3, Math.min(3, initialScale * scaleFactor)));
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      
      const angleDiff = angle - lastTouchAngle;
      onRotate(initialRotation + angleDiff);
    }
  };
  
  const handleTouchEnd = () => {
    setDragStart(null);
    setInitialTouchDistance(null);
    setLastTouchAngle(null);
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setLastTouchAngle(null);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragStart && lastTouchAngle === null) return;
      
      if (e.shiftKey && lastTouchAngle !== null) {
        const rect = stickerRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
          const angleDiff = currentAngle - lastTouchAngle;
          onRotate(initialRotation + angleDiff);
        }
      } else if ((e.ctrlKey || e.metaKey) && dragStart) {
        const deltaY = e.clientY - dragStart.y;
        const scaleFactor = 1 + (deltaY * 0.01);
        const newScale = Math.max(0.3, Math.min(3, initialScale * scaleFactor));
        onResize(newScale);
      } else if (dragStart && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        onMove({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [dragStart, lastTouchAngle, initialRotation, initialScale]);

  return (
    <>
      <div
        ref={stickerRef}
        className={`absolute cursor-move select-none ${selected ? 'ring-2 ring-plantDiary-vividGreen' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          zIndex: zIndex,
          transition: dragStart ? 'none' : 'transform 0.1s ease',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={(e) => {
          e.stopPropagation();
          if (plant.memories.length > 0 && !selected) {
            setShowMemory(true);
          }
        }}
      >
        <div className="w-24 h-32 relative">
          <img 
            src={plant.imageUrl} 
            alt={plant.name}
            className="w-full h-full object-contain pointer-events-none" 
            draggable={false}
          />
          {selected && (
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded-full shadow-lg p-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showMemory} onOpenChange={setShowMemory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{plant.name} Memory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {plant.memories.length > 0 && (
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={plant.memories[0].photoUrl} 
                    alt="Memory" 
                    className="w-full object-cover aspect-video"
                  />
                </div>
                <p className="text-sm">{plant.memories[0].text}</p>
                <div className="flex flex-wrap gap-2">
                  {plant.memories[0].weather && (
                    <span className="text-xs bg-plantDiary-blue/30 px-2 py-0.5 rounded-full">
                      {plant.memories[0].weather}
                    </span>
                  )}
                  {plant.memories[0].location && (
                    <span className="text-xs bg-plantDiary-vibrantYellow/30 px-2 py-0.5 rounded-full">
                      {plant.memories[0].location}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Collage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stickers, setStickers] = useState<Array<{
    id: string;
    plant: Plant;
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    zIndex: number;
  }>>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [showStickerSelector, setShowStickerSelector] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>({
    id: 'white',
    name: 'White Paper',
    type: 'texture',
    style: 'bg-white',
    preview: '#ffffff'
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [collageName, setCollageName] = useState("");
  const [savedCollages, setSavedCollages] = useState<SavedCollage[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollage, setSelectedCollage] = useState<SavedCollage | null>(null);

  const backgroundOptions: BackgroundOption[] = [
    {
      id: 'white',
      name: 'White Paper',
      type: 'texture',
      style: 'bg-white',
      preview: '#ffffff'
    },
    {
      id: 'cream',
      name: 'Cream Paper',
      type: 'texture',
      style: 'bg-amber-50',
      preview: '#fffbeb'
    },
    {
      id: 'kraft',
      name: 'Kraft Paper',
      type: 'texture',
      style: 'bg-yellow-100',
      preview: '#fefce8'
    },
    {
      id: 'vintage',
      name: 'Vintage Paper',
      type: 'texture',
      style: 'bg-orange-50',
      preview: '#fff7ed'
    },
    {
      id: 'textured',
      name: 'Textured Paper',
      type: 'texture',
      style: 'bg-gray-50 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)]',
      preview: '#f9fafb'
    },
    {
      id: 'simple-frame',
      name: 'Simple Frame',
      type: 'frame',
      style: 'bg-white border-8 border-amber-800',
      preview: '#d97706'
    },
    {
      id: 'gold-frame',
      name: 'Gold Frame',
      type: 'frame',
      style: 'bg-white border-8 border-yellow-400 shadow-lg',
      preview: '#facc15'
    },
    {
      id: 'modern-frame',
      name: 'Modern Frame',
      type: 'frame',
      style: 'bg-white border-4 border-gray-800',
      preview: '#1f2937'
    }
  ];

  useEffect(() => {
    const savedCollagesData = localStorage.getItem('savedCollages');
    if (savedCollagesData) {
      try {
        const parsedData = JSON.parse(savedCollagesData);
        const collagesWithDates = parsedData.map((collage: any) => ({
          ...collage,
          createdAt: new Date(collage.createdAt),
        }));
        setSavedCollages(collagesWithDates);
      } catch (error) {
        console.error('Failed to load saved collages:', error);
      }
    }

    if (location.state?.collageToLoad) {
      const collageData = location.state.collageToLoad;
      setStickers(collageData.stickers);
      if (collageData.background) {
        setSelectedBackground(collageData.background);
      }
      toast.success(`Loaded collage "${collageData.name}"`);
    }
  }, [location.state]);

  useEffect(() => {
    if (savedCollages.length > 0) {
      localStorage.setItem('savedCollages', JSON.stringify(savedCollages));
    }
  }, [savedCollages]);

  const handleCanvasClick = () => {
    setSelectedStickerId(null);
  };

  const addSticker = (plant: Plant) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    
    if (!canvasRect) return;
    
    const newSticker = {
      id: `sticker-${Date.now()}`,
      plant,
      position: { 
        x: canvasRect.width / 2 - 50, 
        y: canvasRect.height / 2 - 50 
      },
      rotation: Math.random() * 10 - 5,
      scale: 1,
      zIndex: nextZIndex,
    };
    
    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.id);
    setShowStickerSelector(false);
    setNextZIndex(nextZIndex + 1);
  };

  const handleStickerSelect = (stickerId: string) => {
    setSelectedStickerId(stickerId);
    
    setStickers(stickers.map(sticker => {
      if (sticker.id === stickerId) {
        return { ...sticker, zIndex: nextZIndex };
      }
      return sticker;
    }));
    
    setNextZIndex(nextZIndex + 1);
  };

  const handleStickerMove = (stickerId: string, newPosition: { x: number; y: number }) => {
    setStickers(stickers.map(sticker => {
      if (sticker.id === stickerId) {
        return { ...sticker, position: newPosition };
      }
      return sticker;
    }));
  };

  const handleStickerRotate = (stickerId: string, newRotation: number) => {
    setStickers(stickers.map(sticker => {
      if (sticker.id === stickerId) {
        return { ...sticker, rotation: newRotation };
      }
      return sticker;
    }));
  };

  const handleStickerResize = (stickerId: string, newScale: number) => {
    setStickers(stickers.map(sticker => {
      if (sticker.id === stickerId) {
        return { ...sticker, scale: newScale };
      }
      return sticker;
    }));
  };

  const handleStickerDelete = (stickerId: string) => {
    setStickers(stickers.filter(sticker => sticker.id !== stickerId));
    setSelectedStickerId(null);
  };

  const captureCanvas = async (): Promise<string> => {
    if (!canvasRef.current) return "";
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Failed to capture canvas:', error);
      return "https://via.placeholder.com/400x300/f0f8ff/3a7bd5?text=Plant+Collage";
    }
  };

  const handleSaveCollage = async () => {
    if (!collageName.trim()) {
      toast.error("Please enter a name for your collage");
      return;
    }

    try {
      const imageUrl = await captureCanvas();
      
      const newCollage: SavedCollage = {
        id: `collage-${Date.now()}`,
        name: collageName,
        imageUrl,
        createdAt: new Date(),
        stickers: [...stickers],
        background: selectedBackground,
      };
      
      const updatedCollages = [...savedCollages, newCollage];
      setSavedCollages(updatedCollages);
      
      localStorage.setItem('savedCollages', JSON.stringify(updatedCollages));
      
      setSaveDialogOpen(false);
      setCollageName("");
      
      toast.success(`Collage "${newCollage.name}" saved successfully!`);
      
      navigate("/", { state: { activeTab: "collage" } });
    } catch (error) {
      console.error('Failed to save collage:', error);
      toast.error("Failed to save collage. Please try again.");
    }
  };

  const handleDeleteCollage = () => {
    if (selectedCollage) {
      const updatedCollages = savedCollages.filter(collage => collage.id !== selectedCollage.id);
      setSavedCollages(updatedCollages);
      setSelectedCollage(null);
      setDeleteDialogOpen(false);
      toast.success("Collage deleted successfully!");
    }
  };

  const handleShare = (collage?: SavedCollage) => {
    const shareMessage = collage 
      ? `Sharing collage "${collage.name}"` 
      : "Sharing current collage";
    
    toast.success(shareMessage);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="relative h-screen flex flex-col bg-plantDiary-lightGreen/20">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Plant Collage</h1>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowBackgroundSelector(true)}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Save className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => setSaveDialogOpen(true)} 
                  className="justify-start" 
                  variant="ghost"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save collage
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => handleShare()}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 bg-plantDiary-yellow/10 border-b">
        <p className="text-xs text-center text-gray-600">
          💡 Drag to move • Scroll to scale • Shift+drag to rotate • Ctrl+drag to scale
        </p>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className={`flex-1 relative m-4 rounded-xl shadow-inner overflow-hidden ${selectedBackground.style}`}
        onClick={handleCanvasClick}
      >
        {stickers.map((sticker) => (
          <PlantSticker
            key={sticker.id}
            plant={sticker.plant}
            position={sticker.position}
            rotation={sticker.rotation}
            scale={sticker.scale}
            zIndex={sticker.zIndex}
            selected={selectedStickerId === sticker.id}
            onSelect={() => handleStickerSelect(sticker.id)}
            onMove={(newPosition) => handleStickerMove(sticker.id, newPosition)}
            onRotate={(newRotation) => handleStickerRotate(sticker.id, newRotation)}
            onResize={(newScale) => handleStickerResize(sticker.id, newScale)}
            onDelete={() => handleStickerDelete(sticker.id)}
          />
        ))}
      </div>

      {/* Add sticker button */}
      <div className="fixed bottom-20 right-4">
        <Button 
          className="h-14 w-14 rounded-full shadow-lg bg-plantDiary-vividGreen hover:bg-plantDiary-darkGreen"
          onClick={() => setShowStickerSelector(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Background selector sheet */}
      <Sheet open={showBackgroundSelector} onOpenChange={setShowBackgroundSelector}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Choose Background</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Paper Textures
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {backgroundOptions.filter(bg => bg.type === 'texture').map((background) => (
                  <div
                    key={background.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      selectedBackground.id === background.id 
                        ? 'border-plantDiary-vividGreen shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedBackground(background);
                      setShowBackgroundSelector(false);
                    }}
                  >
                    <div 
                      className={`h-16 w-full rounded-md ${background.style}`}
                      style={{ backgroundColor: background.preview }}
                    />
                    <p className="text-xs text-center mt-1 px-1">{background.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Frame className="h-4 w-4 mr-2" />
                Frames
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {backgroundOptions.filter(bg => bg.type === 'frame').map((background) => (
                  <div
                    key={background.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      selectedBackground.id === background.id 
                        ? 'border-plantDiary-vividGreen shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedBackground(background);
                      setShowBackgroundSelector(false);
                    }}
                  >
                    <div className="h-16 w-full rounded-md bg-white border-4 border-gray-400 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 border-2"
                        style={{ borderColor: background.preview }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 px-1">{background.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sticker selector sheet */}
      <Sheet open={showStickerSelector} onOpenChange={setShowStickerSelector}>
        <SheetContent side="bottom" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Select a Plant Sticker</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto max-h-[70vh] pb-20">
            {dummyPlants.filter(x=>x.hasMemory).map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                variant="small"
                onClick={() => addSticker(plant)}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Save dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Collage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="collageName" className="text-sm font-medium block mb-1">
                Collage Name
              </label>
              <input
                id="collageName"
                type="text"
                value={collageName}
                onChange={(e) => setCollageName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="My Beautiful Collage"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCollage}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collage? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCollage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Collage;
