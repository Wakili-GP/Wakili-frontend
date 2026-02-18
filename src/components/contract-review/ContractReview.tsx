import { useState, useRef } from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import InfoCards from "./InfoCards";
import UploadSection, {
  type ContractAnalysis,
  type UploadSectionRef,
} from "./UploadSection";
import AnalysisResults from "./AnalysisResults";
import FollowUpChat from "./FollowUpChat";
import LatestContracts from "./LatestContracts";
import PlatformStats from "./PlatformStats";
import SatisfactionRating from "./StatisfactionRating";

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
    <div className="space-y-16 max-w-6xl mx-auto">
      <HeroSection onStartNow={handleStartNow} />
      <HowItWorks />
      <InfoCards />
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
      <LatestContracts />
      <PlatformStats />
    </div>
  );
}
