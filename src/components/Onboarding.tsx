import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {motion, AnimatePresence} from "framer-motion";
import guide1Image from '../asset/renderings/guide1.png';
import guide2Image from '../asset/renderings/guide2.png';
import guide3Image from '../asset/renderings/guide3.png';

const Onboarding: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState(0);
    const navigate = useNavigate();

    const screens = [
        {
            title: "Every leaf holds a story",
            description: "Capture plants you find on walks, in parks, or during travels.",
            image: guide1Image,
            bgColor: "#eae6c8",
        },
        {
            title: "Craft stories from nature",
            description: "Use your plant stickers to create emotional collages, add memories, and share with friends.",
            image: guide2Image,
            bgColor: "#708247",
        },
        {
            title: "Create personal plant collection",
            description: "Scan and save plants as 3D memory stickers to keep special moments alive.",
            image: guide3Image,
            bgColor: "#85b59a",
        }
    ];

    const handleNext = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Mark onboarding as completed
            // Note: Using window.location for navigation as requested
            window.location.href = "/";
        }
    };

    const handleSkip = () => {
        // Mark onboarding as completed even if skipped
        // Note: Using window.location for navigation as requested
        window.location.href = "/";
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="h-screen w-screen flex flex-col relative overflow-hidden"
                style={{backgroundColor: screens[currentScreen].bgColor}}
                key={currentScreen}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}
            >
                {/* Main content container */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
                    <motion.div
                        className="flex flex-col items-center max-w-sm text-center"
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        {/* Image container */}
                        <motion.div
                            className="mb-16 w-80 h-80 flex items-center justify-center"
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{duration: 0.5, delay: 0.1}}
                        >
                            <img
                                src={screens[currentScreen].image}
                                alt={screens[currentScreen].title}
                                className="w-full h-full object-contain"
                            />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className={cn(
                                "text-3xl font-bold mb-6 leading-tight",
                                currentScreen === 0 ? "text-gray-700" : "text-white"
                            )}
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.5, delay: 0.3}}
                        >
                            {screens[currentScreen].title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className={cn(
                                "text-lg leading-relaxed px-4",
                                currentScreen === 0 ? "text-gray-600" : "text-white/90"
                            )}
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.5, delay: 0.4}}
                        >
                            {screens[currentScreen].description}
                        </motion.p>
                    </motion.div>
                </div>

                {/* Bottom navigation */}
                <motion.div
                    className="px-6 py-8 bg-white/90 backdrop-blur-sm flex items-center justify-between"
                    initial={{y: 50, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.5}}
                >
                    {/* Skip button */}
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Skip
                    </Button>

                    {/* Indicators */}
                    <div className="flex gap-2">
                        {screens.map((_, index) => (
                            <motion.div
                                key={index}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    currentScreen === index
                                        ? "bg-gray-800 w-6"
                                        : "bg-gray-300 w-2"
                                )}
                                initial={{scale: 0.8}}
                                animate={{scale: currentScreen === index ? 1.1 : 1}}
                                transition={{duration: 0.3}}
                            />
                        ))}
                    </div>

                    {/* Next/Done button */}
                    <Button
                        onClick={handleNext}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-md transition-all duration-200 font-medium"
                    >
                        {currentScreen < screens.length - 1 ? "Next" : "Get Started"}
                    </Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Onboarding;