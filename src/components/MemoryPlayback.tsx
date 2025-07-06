
import React, {useState, useEffect} from "react";
import {Heart, Calendar, MapPin, CloudSun, ChevronLeft, ChevronRight} from "lucide-react";
import {dummyPlants} from "@/lib/dummyData";
import {motion, AnimatePresence} from "framer-motion";
import Header from "./Header";

const MemoryPlayback: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(0);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // 获取有记忆的植物，每次渲染都重新计算以获取最新数据
    const plantsWithMemories = dummyPlants.filter(plant => plant.hasMemory && plant.memories.length > 0);

    // 当路由变化或数据更新时刷新
    useEffect(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const handleNextPage = () => {
        setDirection(1);
        setCurrentIndex((prev) =>
            prev === plantsWithMemories.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevPage = () => {
        setDirection(-1);
        setCurrentIndex((prev) =>
            prev === 0 ? plantsWithMemories.length - 1 : prev - 1
        );
    };

    // Handle empty state
    if (plantsWithMemories.length === 0) {
        return (
            <div className="h-full flex flex-col">
                <Header title="Memory Journal" subtitle="Your plant memories"/>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-plantDiary-purple/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Heart className="h-8 w-8 text-foreground/40"/>
                        </div>
                        <h3 className="text-xl font-medium mb-2">No memories yet</h3>
                        <p className="text-sm text-foreground/60 max-w-xs">
                            Start collecting plants and add memories to see them here
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 确保currentIndex不超出范围
    const safeCurrentIndex = Math.min(currentIndex, plantsWithMemories.length - 1);
    const currentPlant = plantsWithMemories[safeCurrentIndex];
    const currentMemory = currentPlant?.memories[0]; // 显示第一个记忆

    if (!currentMemory) {
        return (
            <div className="h-full flex flex-col">
                <Header title="Memory Journal" subtitle="Your plant memories"/>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <h3 className="text-xl font-medium mb-2">No memory found</h3>
                        <p className="text-sm text-foreground/60">
                            This plant doesn't have any memories
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    const pageTransition = {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
    };

    return (
        <div className="h-full flex flex-col" key={refreshKey}>
            <Header title="Memory Journal" subtitle="Your plant memories"/>

            <div className="flex-1 flex flex-col relative overflow-hidden bg-plantDiary-peach/30 px-4 py-8">
                {/* Journal pages */}
                <div className="absolute inset-0 bg-paper-texture opacity-50"></div>

                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        className="absolute inset-x-4 top-8 bottom-24 rounded-lg shadow-lg bg-white overflow-hidden"
                        key={`${safeCurrentIndex}-${refreshKey}`}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={pageTransition as any}
                    >
                        <div className="h-full flex flex-col">
                            {/* Memory page content */}
                            <div className="p-6 flex-1">
                                <div className="flex flex-col h-full">
                                    <div className="mb-4 text-center">
                                        <span className="inline-block bg-plantDiary-blue/20 px-3 py-1 rounded-full text-xs">
                                          {currentMemory.date.toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mb-6 relative">
                                        <img
                                            src={currentMemory.photoUrl}
                                            alt={currentPlant.name}
                                            className="w-full h-60 object-cover rounded-lg shadow-md"
                                        />
                                        <div
                                            className="absolute top-3 right-3 rounded-full bg-amber-100 p-1.5 memory-glow">
                                            <Heart className="h-4 w-4 text-rose-500 fill-rose-500"/>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 relative mr-3">
                                            <img
                                                src={currentPlant.imageUrl}
                                                alt={currentPlant.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{currentPlant.name}</h3>
                                            <p className="text-xs italic text-foreground/60">{currentPlant.scientificName}</p>
                                        </div>
                                    </div>

                                    <div className="bg-plantDiary-yellow/20 p-4 rounded-lg mb-4 relative hand-drawn">
                                        <p className="text-sm">{currentMemory.text}</p>
                                    </div>

                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {currentMemory.location && (
                                            <div
                                                className="flex items-center text-xs bg-plantDiary-green/30 px-2.5 py-1.5 rounded-full">
                                                <MapPin className="h-3 w-3 mr-1.5"/>
                                                {currentMemory.location}
                                            </div>
                                        )}
                                        {currentMemory.weather && (
                                            <div
                                                className="flex items-center text-xs bg-plantDiary-blue/30 px-2.5 py-1.5 rounded-full">
                                                <CloudSun className="h-3 w-3 mr-1.5"/>
                                                {currentMemory.weather}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Page navigation controls */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8">
                    <button
                        onClick={handlePrevPage}
                        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                        aria-label="Previous page"
                        disabled={plantsWithMemories.length <= 1}
                    >
                        <ChevronLeft className="h-6 w-6 text-foreground/70"/>
                    </button>

                    <div className="text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="text-xs">
                          {safeCurrentIndex + 1} / {plantsWithMemories.length}
                        </span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                        aria-label="Next page"
                        disabled={plantsWithMemories.length <= 1}
                    >
                        <ChevronRight className="h-6 w-6 text-foreground/70"/>
                    </button>
                </div>

                {/* Left and right tap zones for navigation - 只在有多页时显示 */}
                {plantsWithMemories.length > 1 && (
                    <>
                        <div
                            className="absolute top-8 bottom-24 left-0 w-1/3 cursor-pointer"
                            onClick={handlePrevPage}
                        />
                        <div
                            className="absolute top-8 bottom-24 right-0 w-1/3 cursor-pointer"
                            onClick={handleNextPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default MemoryPlayback;
