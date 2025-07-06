import React, { useState } from "react";
import { Leaf, Trophy, Clock, Heart } from "lucide-react";
import { getCollectionStats, getRecentlyCollected } from "@/lib/dummyData";
import PlantCard from "./PlantCard";
import ProfileSettings from "./ProfileSettings";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import avartarImage from '/src/asset/renderings/avatar.png';

interface ProfileDashboardProps {
  onPlantClick?: (plantId: string) => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onPlantClick }) => {
  const [showSettings, setShowSettings] = useState(false);
  const stats = getCollectionStats();
  const recentlyCollected = getRecentlyCollected();
  
  const badges = [
    { name: "Early Botanist", description: "Collected first plant", achieved: true },
    { name: "Memory Keeper", description: "Added 3 memories", achieved: true },
    { name: "Tree Specialist", description: "Collected 5 tree specimens", achieved: false },
  ];

  const handleAvatarClick = () => {
    setShowSettings(true);
  };

  const handlePlantCardClick = (plant: any) => {
    if (onPlantClick) {
      onPlantClick(plant.id);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-10 p-4 border-b border-plantDiary-gray bg-gradient-to-r from-white/80 to-plantDiary-lightGreen/50 backdrop-blur-sm flex items-center gap-4">
        <button 
          onClick={handleAvatarClick}
          className="w-16 h-16 rounded-full gradient-purple flex items-center justify-center shadow-md floating-element cursor-pointer hover:scale-105 transition-transform"
        >
          <img src={avartarImage} alt="Avatar" className="w-full h-full rounded-full" />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Jane's Plant Diary</h1>
          <p className="text-sm text-foreground/60">Plant collector since May 2023</p>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Collection Stats</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="stat-card glass-card">
            <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center mx-auto mb-2 shadow-inner-light">
              <Leaf className="h-5 w-5 text-plantDiary-darkGreen" />
            </div>
            <p className="text-2xl font-bold animate-pulse-light">{stats.totalPlants}</p>
            <p className="text-xs text-foreground/60">Plants Collected</p>
          </div>
          <div className="stat-card glass-card">
            <div className="w-10 h-10 rounded-full gradient-yellow flex items-center justify-center mx-auto mb-2 shadow-inner-light">
              <Heart className="h-5 w-5 text-plantDiary-brightOrange" />
            </div>
            <p className="text-2xl font-bold animate-pulse-light">{stats.plantsWithMemories}</p>
            <p className="text-xs text-foreground/60">Memories Added</p>
          </div>
        </div>
        
        <div className="paper-card p-4 mb-6 bg-gradient-to-br from-white/90 to-plantDiary-lightGreen/30">
          <h3 className="text-sm font-semibold mb-2">Memory Completion</h3>
          <Progress 
            value={stats.completionRate} 
            className="h-2 mb-2 overflow-hidden"
            style={{
              background: "linear-gradient(to right, rgba(117, 183, 152, 0.3), rgba(117, 183, 152, 0.1))",
              backgroundSize: "200% 100%",
            }}
          />
          <p className="text-xs text-right text-foreground/60">
            {stats.plantsWithMemories} of {stats.totalPlants} plants have memories
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <div className="paper-card p-4 mb-6">
          <div className="space-y-3">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl transition-all",
                  badge.achieved ? "hover:bg-plantDiary-vibrantYellow/10" : ""
                )}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${badge.achieved 
                    ? 'gradient-yellow shadow-glow-sm memory-glow' 
                    : 'bg-plantDiary-gray/50'}`}
                >
                  <Trophy className={`h-5 w-5 
                    ${badge.achieved 
                      ? 'text-amber-500' 
                      : 'text-foreground/30'}`} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium">{badge.name}</p>
                    {!badge.achieved && (
                      <Badge variant="outline" className="ml-2 text-xs">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Recently Collected
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {recentlyCollected.map(plant => (
            <PlantCard 
              key={plant.id} 
              plant={plant} 
              variant="small"
              onClick={() => handlePlantCardClick(plant)}
            />
          ))}
        </div>
      </div>

      <ProfileSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default ProfileDashboard;
