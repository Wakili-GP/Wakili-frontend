// import IndexPage from "./pages/IndexPage";
// import LawyerOnboarding from "./pages/LawyerOnboarding";
// import LawyerProfile from "./pages/LawyerProfile";
// import NotFound from "./pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LawyerReview from "./pages/LawyerReview";
// import HomePage from "./pages/HomePage";
// import ClientProfile from "./pages/ClientProfile";
const App = () => (
  <TooltipProvider>
    <Sonner />
    <LawyerReview />
  </TooltipProvider>
);
export default App;
