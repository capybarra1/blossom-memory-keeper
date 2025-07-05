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
import Layout from "@/components/Layout"; // 路径视情况调整

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
  
  // Show loading state while checking localStorage
  if (hasCompletedOnboarding === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout> {/* ✅ 添加 Layout 包裹整个路由 */}
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
