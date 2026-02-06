import IndexPage from "./pages/IndexPage";
import LawyerOnboarding from "./pages/LawyerOnboarding";
import LawyerProfile from "./pages/LawyerProfile";
import NotFound from "./pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LawyerReview from "./pages/LawyerReview";
import HomePage from "./pages/HomePage";
import ClientProfile from "./pages/ClientProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => (
  <TooltipProvider>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/lawyer/:id" element={<LawyerProfile />} />
        <Route path="/lawyer/:id/review" element={<LawyerReview />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/verify/lawyer" element={<LawyerOnboarding />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);
export default App;
