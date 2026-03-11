import { useState } from "react";
import HeroSection from "../components/contract-review/HeroSection";
import HowItWorks from "../components/contract-review/HowItWorks";
import ProductDemo from "../components/contract-review/ProductDemo";
import UploadSection from "../components/contract-review/UploadSection";
import type { ContractAnalysis } from "../components/contract-review/UploadSection";
import AnalysisResults from "../components/contract-review/AnalysisResults";
import FollowUpChat from "../components/contract-review/FollowUpChat";
import PlatformStats from "../components/contract-review/PlatformStats";
import RecentContracts from "../components/contract-review/RecentContracts";
import SatisfactionRating from "../components/contract-review/StatisfactionRating";

const ContractReview = () => {
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [filename, setFilename] = useState("");
  const [analysisId, setAnalysisId] = useState("");

  const handleAnalysisComplete = (
    result: ContractAnalysis,
    name: string,
    id: string,
  ) => {
    setAnalysis(result);
    setFilename(name);
    setAnalysisId(id);
  };

  const handleReset = () => {
    setAnalysis(null);
    setFilename("");
    setAnalysisId("");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* TODO: Handle "Start Now" button click to scroll to upload section */}
      <HeroSection />
      <HowItWorks />
      <ProductDemo />
      <UploadSection onAnalysisComplete={handleAnalysisComplete} />
      {analysis && (
        <>
          <AnalysisResults
            analysis={analysis}
            filename={filename}
            onReset={handleReset}
          />
          <FollowUpChat analysisId={analysisId} />
          <SatisfactionRating />
        </>
      )}
      {/* TODO: Fetch Platform Stats From Backend */}
      <PlatformStats />
      {/* TODO: Manage Recent Contracts Per User From Backend */}
      <RecentContracts />
    </div>
  );
};

export default ContractReview;
