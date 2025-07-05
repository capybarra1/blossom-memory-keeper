import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SpecimenBook from "@/components/SpecimenBook";
import MemoryPlayback from "@/components/MemoryPlayback";
import ProfileDashboard from "@/components/ProfileDashboard";
import CollageGallery from "@/components/CollageGallery";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("specimens");

  const handleActiveTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "collect") {
      navigate("/identify");
    }
  };

  // For testing - reset onboarding status
  const resetOnboarding = () => {
    localStorage.removeItem("onboardingCompleted");
    window.location.reload();
  };

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
            <ProfileDashboard />
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
      setActiveTab("specimens");
    }
  }, [location.pathname]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* === Header全局顶部栏结束 === */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>
      <div className="h-16"></div> {/* Spacer for nav bar */}
      <Navigation activeTab={activeTab} setActiveTab={handleActiveTabChange} />
    </div>
  );
};

export default Index;
