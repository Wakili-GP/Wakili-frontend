import IndexPage from "./pages/IndexPage";
import LawyerOnboarding from "./pages/LawyerOnboarding";
import LawyerProfile from "./pages/LawyerProfile";
import NotFound from "./pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LawyerReview from "./pages/LawyerReview";
import ClientProfile from "./pages/ClientProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import HomeLayout from "./components/HomeLayout";
import AiChatPage from "./pages/AiChatPage";
import LawyersPage from "./pages/LawyersPage";
import AiLegalReviewPage from "./pages/AiLegalReviewPage";
import ForumPage from "./pages/ForumPage";
import ArticlesPage from "./pages/ArticlesPage";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/lawyer/:id/review" element={<LawyerReview />} />

          {/* Protected Routes - Shared layout with navbar & footer */}
          <Route
            element={
              <ProtectedRoute>
                <HomeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/ai-chat" element={<AiChatPage />} />
            <Route path="/lawyers" element={<LawyersPage />} />
            <Route path="/ai-contract-review" element={<AiLegalReviewPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/profile" element={<ClientProfile />} />
          </Route>

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
  </AuthProvider>
);
export default App;
