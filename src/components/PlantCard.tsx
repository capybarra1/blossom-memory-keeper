
import React from "react";
import { Star } from "lucide-react";
import { Plant, formatDateString } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import OptimizedImage from "./OptimizedImage";

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
  variant?: "grid" | "list" | "small";
}

const PlantCard: React.FC<PlantCardProps> = ({
                                               plant,
                                               onClick,
                                               variant = "grid"
                                             }) => {
  const hasMemory = plant.memories.length > 0;

  const getGradientClass = () => {
    const categoryHash = plant.category.charCodeAt(0) % 4;
    switch(categoryHash) {
      case 0: return "gradient-green";
      case 1: return "gradient-yellow";
      case 2: return "gradient-peach";
      case 3: return "gradient-purple";
      default: return "gradient-green";
    }
  };

  return (
      <div
          onClick={onClick}
          className={cn(
              "cursor-pointer overflow-hidden bg-gradient-to-b from-[#E6F4EA] to-white rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between transition-transform duration-200 hover:scale-105 relative",
              variant === "grid" && "w-full aspect-[5/8]",
              variant === "list" && "flex-row items-center w-full h-24",
              variant === "small" && "w-full aspect-square"
          )}
      >
        {hasMemory && (
            <div className="absolute top-3 right-3 z-10 bg-yellow-100 rounded-full p-1.5 shadow-sm">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            </div>
        )}

        {variant === "list" ? (
            <>
              <div className="h-full w-24 relative rounded-l-3xl overflow-hidden">
                <OptimizedImage
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="h-full w-full object-fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-sm font-semibold text-gray-800">{plant.name}</h3>
                <p className="text-xs italic text-gray-500 mt-1">{plant.scientificName}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateString(plant.dateCollected)}</p>
              </div>
            </>
        ) : (
            <>
              <div className="relative w-full flex-1 flex items-center justify-center p-6">
                <OptimizedImage
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="max-h-32 w-auto object-contain mx-auto drop-shadow-sm"
                />
              </div>
              <div className="px-4 py-4 bg-white rounded-b-3xl mt-auto">
                <h3 className={cn(
                    "font-semibold text-gray-800 leading-tight",
                    variant === "small" ? "text-xs" : "text-sm"
                )}>
                  {plant.name}
                </h3>
                {variant !== "small" && (
                    <p className="text-xs mt-1 text-gray-500">
                      {formatDateString(plant.dateCollected)}
                    </p>
                )}
              </div>
            </>
        )}
      </div>
  );
};

export default PlantCard;
