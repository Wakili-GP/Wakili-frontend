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
import AiChatPage from "./pages/AiChatPage";
import LawyerSearchPage from "./pages/LawyersSearchPage";
import LawyerSearch from "./components/LawyerSearch";
import AiLegalReviewPage from "./pages/AiLegalReviewPage";
import ForumPage from "./pages/ForumPage";
import ArticlesPage from "./pages/ArticlesPage";
import { useAuthStore } from "@/stores/auth.store";
import PaymentSuccessfulPage from "./pages/PaymentSuccessfulPage";
import NotificationsPage from "./pages/NotificationsPage";
import { useNotifications } from "./stores/notification.store";

const SharedLayout = ({ children }: { children: ReactNode }) => (
  <HomeLayout>{children}</HomeLayout>
);
import AuthModals from "./components/AuthModals";

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { connect, disconnect } = useNotifications();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (isAuthenticated && token) {
      connect(token).catch(console.error);
    } else {
      disconnect().catch(console.error);
    }
  }, [isAuthenticated, connect, disconnect]);

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
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <SharedLayout>
                  <NotificationsPage />
                </SharedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/appointments/:id/review" element={<LawyerReview />} />
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
                <ArticlesPage />
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
