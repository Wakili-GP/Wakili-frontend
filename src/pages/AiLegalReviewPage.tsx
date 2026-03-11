import { useState, useRef } from "react";
import HeroSection from "../components/contract-review/HeroSection";
import HowItWorks from "../components/contract-review/HowItWorks";
import ProductDemo from "../components/contract-review/ProductDemo";
import UploadSection, {
  type ContractAnalysis,
  type UploadSectionRef,
} from "../components/contract-review/UploadSection";
import AnalysisResults from "../components/contract-review/AnalysisResults";
import FollowUpChat from "../components/contract-review/FollowUpChat";
import PlatformStats from "../components/contract-review/PlatformStats";
import RecentContracts from "../components/contract-review/RecentContracts";
import SatisfactionRating from "../components/contract-review/StatisfactionRating";

export default function ContractReview() {
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [filename, setFilename] = useState("");
  const uploadRef = useRef<UploadSectionRef>(null);

  const handleStartNow = () => {
    uploadRef.current?.scrollIntoView();
  };

  const handleAnalysisComplete = (data: ContractAnalysis, name: string) => {
    setAnalysis(data);
    setFilename(name);
  };

  const handleReset = () => {
    setAnalysis(null);
    setFilename("");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection onStartNow={handleStartNow} />

      <HowItWorks />

      <ProductDemo />

      <UploadSection
        ref={uploadRef}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {analysis && (
        <>
          <AnalysisResults
            analysis={analysis}
            filename={filename}
            onReset={handleReset}
          />
          <FollowUpChat />
          <SatisfactionRating />
        </>
      )}

      <PlatformStats />

      <RecentContracts />
    </div>
  );
}
