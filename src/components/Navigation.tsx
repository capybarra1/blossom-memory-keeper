import React from "react";
import { Camera, Book, Heart, User, Image } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "specimens", icon: Book, label: "Specimens" },
    { id: "memories", icon: Heart, label: "Memories" },
    { id: "collage", icon: Image, label: "Collage" },
    { id: "profile", icon: User, label: "Profile" }
  ];

  const handleCameraClick = () => {
    navigate("/identify");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* === 底部导航栏美化开始 === */}
      <button
        onClick={handleCameraClick}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -top-7 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-[#75B798] shadow-lg",
          "z-50", 
          location.pathname === "/identify" ? "scale-110 shadow-xl" : ""
        )}
      >
        <Camera 
          className={cn(
            "h-7 w-7 text-white transition-all",
            location.pathname === "/identify" ? "stroke-[2.5px]" : "stroke-[2px]"
          )} 
        />
      </button>

      {/* Navigation Bar */}
      {/* === grid方案开始 === */}
      <nav className="relative z-10 grid grid-cols-[1fr_1fr_0.5fr_1fr_1fr] items-center h-20 bg-white bg-opacity-90 backdrop-blur-sm overflow-visible border-t border-plantDiary-gray px-8">
        {/* === grid方案修正开始 === */}
        {/* 左1 */}
        <button
          onClick={() => setActiveTab(navItems[0].id)}
          className={cn(
            "flex flex-col items-center justify-center h-full transition-all duration-300",
            activeTab === navItems[0].id ? "text-[#75B798]" : "text-foreground/60"
          )}
        >
          {React.createElement(navItems[0].icon, {
            className: cn("h-5 w-5 mb-1 transition-all", activeTab === navItems[0].id ? "stroke-[2.5px] text-[#75B798]" : "stroke-[1.5px]")
          })}
          <span className="text-xs font-medium">{navItems[0].label}</span>
          {activeTab === navItems[0].id && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-full bg-[#75B798]" />
          )}
        </button>
        {/* 左2 */}
        <button
          onClick={() => setActiveTab(navItems[1].id)}
          className={cn(
            "flex flex-col items-center justify-center h-full transition-all duration-300",
            activeTab === navItems[1].id ? "text-[#75B798]" : "text-foreground/60"
          )}
        >
          {React.createElement(navItems[1].icon, {
            className: cn("h-5 w-5 mb-1 transition-all", activeTab === navItems[1].id ? "stroke-[2.5px] text-[#75B798]" : "stroke-[1.5px]")
          })}
          <span className="text-xs font-medium">{navItems[1].label}</span>
          {activeTab === navItems[1].id && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-full bg-[#75B798]" />
          )}
        </button>
        {/* 中间空格 */}
        <div />
        {/* 右1 */}
        <button
          onClick={() => setActiveTab(navItems[2].id)}
          className={cn(
            "flex flex-col items-center justify-center h-full transition-all duration-300",
            activeTab === navItems[2].id ? "text-[#75B798]" : "text-foreground/60"
          )}
        >
          {React.createElement(navItems[2].icon, {
            className: cn("h-5 w-5 mb-1 transition-all", activeTab === navItems[2].id ? "stroke-[2.5px] text-[#75B798]" : "stroke-[1.5px]")
          })}
          <span className="text-xs font-medium">{navItems[2].label}</span>
          {activeTab === navItems[2].id && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-full bg-[#75B798]" />
          )}
        </button>
        {/* 右2 */}
        <button
          onClick={() => setActiveTab(navItems[3].id)}
          className={cn(
            "flex flex-col items-center justify-center h-full transition-all duration-300",
            activeTab === navItems[3].id ? "text-[#75B798]" : "text-foreground/60"
          )}
        >
          {React.createElement(navItems[3].icon, {
            className: cn("h-5 w-5 mb-1 transition-all", activeTab === navItems[3].id ? "stroke-[2.5px] text-[#75B798]" : "stroke-[1.5px]")
          })}
          <span className="text-xs font-medium">{navItems[3].label}</span>
          {activeTab === navItems[3].id && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-full bg-[#75B798]" />
          )}
        </button>
        {/* === grid方案修正结束 === */}
      </nav>
      {/* === grid方案结束 === */}
      
    </div>
  );
};

export default Navigation;
