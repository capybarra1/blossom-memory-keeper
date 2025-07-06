import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlantIdentification from "./pages/PlantIdentification";
import Collage from "./pages/Collage";
import OnboardingPage from "./pages/OnboardingPage";
import CommunityCollage from "./components/CommunityCollage";
import Layout from "@/components/Layout";
import SplashScreen from "@/components/SplashScreen";
import { SafeAreaProvider } from "@/contexts/SafeAreaContext";

// Check if user has completed onboarding
const useOnboardingStatus = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  
  useEffect(() => {
    const onboardingStatus = localStorage.getItem("onboardingCompleted");
    setHasCompletedOnboarding(onboardingStatus === "true");
  }, []);
  
  return { hasCompletedOnboarding };
};

const queryClient = new QueryClient();

const App = () => {
  const { hasCompletedOnboarding } = useOnboardingStatus();
  const [showSplash, setShowSplash] = useState(true); // 改为true
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 2秒后隐藏splash screen
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show splash screen for 2 seconds
  if (showSplash) {
    return <SplashScreen />;
  }
  
  // Show loading state while checking localStorage
  if (hasCompletedOnboarding === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SafeAreaProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    hasCompletedOnboarding ? (
                      <Index />
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  } 
                />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/identify" element={<PlantIdentification />} />
                <Route path="/collage" element={<Collage />} />
                <Route path="/community-collage" element={<CommunityCollage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </SafeAreaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
