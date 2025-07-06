
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SpecimenBook from "@/components/SpecimenBook";
import MemoryPlayback from "@/components/MemoryPlayback";
import ProfileDashboard from "@/components/ProfileDashboard";
import CollageGallery from "@/components/CollageGallery";
import Header from "@/components/Header";
import { useSafeArea } from "@/contexts/SafeAreaContext";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("specimens");
  const { setSafeAreaColor } = useSafeArea();

  // 定义各页面的安全区域颜色
  const getColorForTab = (tab: string) => {
    switch (tab) {
      case "specimens":
      case "memories":
      case "collage":
        return "#75B798"; // 绿色
      case "profile":
        return "#75B798"; // Jane's Plant Diary部分的背景色（绿色）
      default:
        return "#75B798";
    }
  };

  const handleActiveTabChange = (tab: string) => {
    setActiveTab(tab);
    setSafeAreaColor(getColorForTab(tab));
    if (tab === "collect") {
      navigate("/identify");
    }
  };

  const handlePlantClick = (plantId: string) => {
    // 切换到标本页面并可以在这里添加选中特定植物的逻辑
    setActiveTab("specimens");
  };

  // For testing - reset onboarding status
  const resetOnboarding = () => {
    localStorage.removeItem("onboardingCompleted");
    window.location.reload();
  };

  // 当标签页改变时更新安全区域颜色
  useEffect(() => {
    setSafeAreaColor(getColorForTab(activeTab));
  }, [activeTab, setSafeAreaColor]);

  // 监听来自拼贴画保存的状态，切换到collage标签页
  useEffect(() => {
    const handleCollageSaved = () => {
      setActiveTab("collage");
    };

    window.addEventListener('collageSaved', handleCollageSaved);
    return () => window.removeEventListener('collageSaved', handleCollageSaved);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "specimens":
        return <SpecimenBook />;
      case "memories":
        return <MemoryPlayback />;
      case "collage":
        return <CollageGallery onCreateNew={() => navigate("/collage")} />;
      case "profile":
        return (
          <>
            <ProfileDashboard onPlantClick={handlePlantClick} />
            <div className="p-4">
              <button 
                onClick={resetOnboarding}
                className="text-xs text-muted-foreground underline"
              >
                Reset onboarding (for testing)
              </button>
            </div>
          </>
        );
      default:
        return <SpecimenBook />;
    }
  };

  // Set the specimens tab as active when returning from identification
  useEffect(() => {
    if (location.pathname === "/") {
      // 检查是否从拼贴画页面跳转回来
      const fromCollage = location.state?.fromCollage;
      if (fromCollage) {
        setActiveTab("collage");
      } else {
        setActiveTab("specimens");
      }
    }
  }, [location.pathname, location.state]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>
      <div className="h-16"></div>
      <Navigation activeTab={activeTab} setActiveTab={handleActiveTabChange} />
    </div>
  );
};

export default Index;
