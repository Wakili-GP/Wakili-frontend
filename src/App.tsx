import { useEffect, type ReactNode } from "react";
import IndexPage from "./pages/IndexPage";
import LawyerOnboarding from "./pages/LawyerOnboarding";
import LawyerProfile from "./pages/LawyerProfile";
import NotFound from "./pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LawyerReview from "./pages/LawyerReview";
import ClientProfile from "./pages/ClientProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import HomeLayout from "./components/HomeLayout";
import AiChatPage from "./pages/AiChatPage";
import LawyerSearchPage from "./pages/LawyersSearchPage";
import AiLegalReviewPage from "./pages/AiLegalReviewPage";
import ForumPage from "./pages/ForumPage";
import ArticlesPage from "./pages/ArticlesPage";
import { useAuthStore } from "@/stores/auth.store";

const SharedLayout = ({ children }: { children: ReactNode }) => (
  <HomeLayout>{children}</HomeLayout>
);

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/lawyer/:id/review" element={<LawyerReview />} />
          {/* Main Routes */}
          <Route path="/ai-chat" element={<AiChatPage />} />
          <Route
            path="/find-lawyers"
            element={
              <SharedLayout>
                <LawyerSearchPage />
              </SharedLayout>
            }
          />
          <Route
            path="/ai-contract-review"
            element={
              <SharedLayout>
                <AiLegalReviewPage />
              </SharedLayout>
            }
          />
          <Route
            path="/forum"
            element={
              <SharedLayout>
                <ForumPage />
              </SharedLayout>
            }
          />
          <Route
            path="/articles"
            element={
              <SharedLayout>
                <ArticlesPage />
              </SharedLayout>
            }
          />
          <Route
            path="/verify/lawyer"
            element={
              <ProtectedRoute requiredUserType="lawyer">
                <LawyerOnboarding />
              </ProtectedRoute>
            }
          />
          {/* Access Denied */}
          <Route path="/forbidden" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};
export default App;
