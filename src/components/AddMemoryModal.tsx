
import React, { useState } from "react";
import { X, Heart, MapPin, CloudSun, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plant } from "@/lib/dummyData";

interface AddMemoryModalProps {
  plant: Plant;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: {
    text: string;
    location: string;
    weather: string;
    photoUrl: string;
    date: Date;
  }) => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  plant,
  isOpen,
  onClose,
  onSave,
}) => {
  const [memoryText, setMemoryText] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [photoUrl, setPhotoUrl] = useState(plant.imageUrl);

  const handleSave = () => {
    if (memoryText.trim()) {
      onSave({
        text: memoryText,
        location,
        weather,
        photoUrl,
        date: new Date(),
      });
      setMemoryText("");
      setLocation("");
      setWeather("");
      onClose();
    }
  };

  const handleCancel = () => {
    setMemoryText("");
    setLocation("");
    setWeather("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-semibold">Add Memory</h2>
          <button onClick={handleCancel} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium">{plant.name}</h3>
              <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Memory</label>
            <Textarea
              placeholder="What makes this plant special to you?"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location (optional)
            </label>
            <Input
              placeholder="Where did you find this plant?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <CloudSun className="h-4 w-4 inline mr-1" />
              Weather (optional)
            </label>
            <Input
              placeholder="What was the weather like?"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 pb-24 border-t">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-accent hover:bg-accent/90"
              disabled={!memoryText.trim()}
            >
              <Heart className="h-4 w-4 mr-2" />
              Save Memory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;
