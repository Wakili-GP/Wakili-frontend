import { useEffect, type ReactNode } from "react";
import IndexPage from "./pages/IndexPage";
import LawyerOnboarding from "./pages/LawyerOnboarding";
import LawyerProfile from "./pages/LawyerProfile";
import LawyerDashboard from "./pages/LawyerDashboard";
import NotFound from "./pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LawyerReview from "./pages/LawyerReview";
import ClientProfile from "./pages/ClientProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import HomeLayout from "./components/HomeLayout";
import AiChatLayout from "@/pages/ai-chat/AiChatLayout";
import AiChatHome from "@/pages/ai-chat/AiChatHome";
import AiChatPage from "@/pages/ai-chat/AiChatPage";
import LawyerSearchPage from "./pages/LawyersSearchPage";
import LawyerSearch from "./components/LawyerSearch";
import AiLegalReviewPage from "./pages/AiLegalReviewPage";
import ForumPage from "./pages/ForumPage";
import ArticlesLandingPage from "./pages/articles/ArticlesLandingPage";
import ArticlesSearchPage from "./pages/articles/ArticlesSearchPage";
import ArticleReaderPage from "./pages/articles/ArticleReaderPage";
import { useAuthStore } from "@/stores/auth.store";
import PaymentSuccessfulPage from "./pages/PaymentSuccessfulPage";

const SharedLayout = ({ children }: { children: ReactNode }) => (
  <HomeLayout>{children}</HomeLayout>
);
import AuthModals from "./components/AuthModals";

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthModals />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route
            path="/lawyer/dashboard"
            element={
              <ProtectedRoute requiredUserType="Lawyer">
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredUserType="Client">
                <ClientProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/appointments/:id/review" element={<LawyerReview />} />
          {/* Main Routes */}
          <Route path="/ai-chat" element={<AiChatLayout />}>
            <Route index element={<AiChatHome />} />
            <Route path=":id" element={<AiChatPage />} />
          </Route>
          <Route
            path="/find-lawyers"
            element={
              <SharedLayout>
                <LawyerSearchPage />
              </SharedLayout>
            }
          />
          <Route
            path="/find-lawyers/results"
            element={
              <SharedLayout>
                <LawyerSearch />
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
                <ArticlesLandingPage />
              </SharedLayout>
            }
          />
          <Route
            path="/articles/search"
            element={
              <SharedLayout>
                <ArticlesSearchPage />
              </SharedLayout>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <SharedLayout>
                <ArticleReaderPage />
              </SharedLayout>
            }
          />
          <Route
            path="/lawyer-onboarding"
            element={
              <ProtectedRoute requiredUserType="Lawyer">
                <LawyerOnboarding />
              </ProtectedRoute>
            }
          />
          {/* https://wakiliy.com/payment/success */}
          <Route path="/payment/success" element={<PaymentSuccessfulPage />} />
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
