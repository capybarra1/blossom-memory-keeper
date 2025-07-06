
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Heart, X, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dummyPlants, Plant, getPlantsByCategory, formatDateString, updatePlantWithMemory, getPlantById } from "@/lib/dummyData";
import PlantCard from "./PlantCard";
import AddMemoryModal from "./AddMemoryModal";
import { cn } from "@/lib/utils";
import Header from "./Header";

const SpecimenBook: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [plants, setPlants] = useState(dummyPlants);
  const [refreshKey, setRefreshKey] = useState(0);

  // 刷新植物数据
  const refreshPlants = () => {
    setPlants([...dummyPlants]);
    setRefreshKey(prev => prev + 1);
  };

  // 当数据更新时刷新组件
  useEffect(() => {
    refreshPlants();
  }, [refreshKey]);

  const plantsByCategory = getPlantsByCategory();
  const categories = ["Flower", "Leaf", "Seed", "Fruit"];

  // Get current time to personalize greeting
  const currentHour = new Date().getHours();
  let greeting = "Good day";

  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const filteredPlants = searchQuery
    ? plants.filter(plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : plants;

  const handlePlantClick = (plant: Plant) => {
    // 获取最新的植物数据
    const updatedPlant = getPlantById(plant.id) || plant;
    setSelectedPlant(updatedPlant);
  };

  const handleClose = () => {
    setSelectedPlant(null);
  };

  const handleAddMemory = () => {
    setShowAddMemory(true);
  };

  const handleSaveMemory = (memory: any) => {
    if (selectedPlant) {
      console.log('Saving memory:', memory);
      
      // 使用全局函数更新植物数据
      const savedMemory = updatePlantWithMemory(selectedPlant.id, {
        text: memory.text,
        location: memory.location,
        weather: memory.weather,
        photoUrl: memory.photoUrl,
        date: memory.date
      });
      
      console.log('Memory saved:', savedMemory);
      
      // 刷新植物数据
      refreshPlants();
      
      // 更新当前选中的植物
      const updatedPlant = getPlantById(selectedPlant.id);
      if (updatedPlant) {
        setSelectedPlant(updatedPlant);
      }
      
      setShowAddMemory(false);
    }
  };

  return (
    <div className="h-full flex flex-col ">
      {/* === Header隐藏逻辑开始 === */}
      {!selectedPlant && (
        <Header title="Good Morning" subtitle="Start your botanical journey" />
      )}

      {!selectedPlant && (
        <div className="relative px-4 pb-4 mt-4 flex items-center">
          <Input prefix={<Search className="h-6 w-6 text-foreground/40 mr-2" />}
            placeholder="Search plants..."
            className="flex-1 rounded-full bg-white border border-plantDiary-gray shadow-none focus:ring-2 focus:ring-accent/30 text-base"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {selectedPlant ? (
          <div className="h-full animate-fade-in">
            <div className="relative h-2/5">
              <img
                src={selectedPlant.imageUrl}
                alt={selectedPlant.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-white text-xl font-semibold">{selectedPlant.name}</h2>
                <p className="text-white/80 text-sm italic">{selectedPlant.scientificName}</p>
              </div>
            </div>

            <div className="h-3/5 p-4 overflow-y-auto bg-gradient-to-b from-white/95 to-plantDiary-lightGreen/20">
              <div className="floating-card rounded-2xl p-4 mb-4">
                <h3 className="text-sm font-medium text-plantDiary-darkGreen mb-1">Date Collected</h3>
                <p className="text-base mb-3">{formatDateString(selectedPlant.dateCollected)}</p>

                <h3 className="text-sm font-medium text-plantDiary-darkGreen mb-1">Description</h3>
                <p className="text-base mb-3">{selectedPlant.description}</p>

                <h3 className="text-sm font-medium text-plantDiary-darkGreen mb-1">Category</h3>
                <div className="inline-block bg-plantDiary-lightGreen px-3 py-1 rounded-full text-sm">
                  {selectedPlant.category}
                </div>
              </div>

              {selectedPlant.hasMemory && selectedPlant.memories.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Heart className="h-4 w-4 text-rose-500 mr-2 fill-rose-500" />
                    Attached Memories
                  </h3>

                  {selectedPlant.memories.map((memory, index) => (
                    <div key={memory.id} className="floating-card rounded-2xl p-4 relative mb-3">
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl rounded-tr-2xl pointer-events-none"></div>
                      <div className="flex gap-3 mb-3">
                        <img
                          src={memory.photoUrl}
                          alt="Memory"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm mb-2">{memory.text}</p>
                          <div className="flex flex-wrap gap-2">
                            {memory.weather && (
                              <span className="text-xs bg-plantDiary-blue/30 px-2 py-0.5 rounded-full">
                                {memory.weather}
                              </span>
                            )}
                            {memory.location && (
                              <span className="text-xs bg-plantDiary-vibrantYellow/30 px-2 py-0.5 rounded-full">
                                {memory.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/60">
                        {formatDateString(memory.date)}
                      </p>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={handleAddMemory}
                    className="w-full bg-gradient-to-r from-plantDiary-vividGreen to-plantDiary-darkGreen hover:from-plantDiary-darkGreen hover:to-plantDiary-vividGreen text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add Another Memory
                  </Button>
                </div>
              ) : (
                <div className="text-center p-4 floating-card rounded-2xl bg-gradient-to-br from-white/90 to-plantDiary-lightGreen/20">
                  <div className="w-16 h-16 bg-plantDiary-purple/30 rounded-full flex items-center justify-center mx-auto mb-3 floating-element">
                    <Plus className="h-8 w-8 text-foreground/40" />
                  </div>
                  <h3 className="font-medium mb-1">No memories yet</h3>
                  <p className="text-sm text-foreground/60 mb-3">
                    Add a memory to this specimen
                  </p>
                  <Button 
                    onClick={handleAddMemory}
                    className="w-full bg-gradient-to-r from-plantDiary-vividGreen to-plantDiary-darkGreen hover:from-plantDiary-darkGreen hover:to-plantDiary-vividGreen text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add Memory
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="p-4 grid grid-cols-2 gap-4 bg-gradient-to-b from-white/60 to-plantDiary-yellow/10">
            {filteredPlants.length > 0 ? (
              filteredPlants.map(plant => (
                <PlantCard
                  key={`${plant.id}-${refreshKey}`}
                  plant={plant}
                  onClick={() => handlePlantClick(plant)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center p-8">
                <p className="text-foreground/60">No plants matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue={categories[0]} className="h-full">
            <TabsList className="w-full flex
                                 gap-2 justify-start
                                 px-4 pt-4 pb-1
                                 bg-transparent
                                 overflow-x-auto flex-nowrap whitespace-nowrap
                                 shadow-none border-none scrollbar-hide
                                 hover:scrollbar-default">
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    "flex items-center justify-center px-3 py-1.5 rounded-[12px] text-foreground/60 transition-all text-base",
                    "data-[state=active]:bg-[rgba(224,255,209,0.3)] data-[state=active]:text-[#3D876A] data-[state=active]:font-semibold data-[state=active]:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)]"
                  )}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map(category => (
              <TabsContent
                key={category}
                value={category}
                className="p-4 h-[calc(100%-50px)] overflow-y-auto bg-gradient-to-b from-white/60 to-plantDiary-yellow/10"
              >
                <div className="grid grid-cols-2 gap-4">
                  {(plantsByCategory[category] || []).map(plant => (
                    <PlantCard
                      key={`${plant.id}-${refreshKey}`}
                      plant={plant}
                      onClick={() => handlePlantClick(plant)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <AddMemoryModal
        plant={selectedPlant || plants[0]}
        isOpen={showAddMemory}
        onClose={() => setShowAddMemory(false)}
        onSave={handleSaveMemory}
      />
    </div>
  );
};

export default SpecimenBook;
