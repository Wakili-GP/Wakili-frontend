import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [uploadResetSignal, setUploadResetSignal] = useState(0);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const handleAnalysisComplete = (
    result: ContractAnalysis,
    name: string,
    id: string,
  ) => {
    setAnalysis(result);
    setFilename(name);
    setAnalysisId(id);
  };

  useEffect(() => {
    if (!analysis) return;

    const timer = window.setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [analysis]);

  const handleReset = () => {
    setAnalysis(null);
    setFilename("");
    setAnalysisId("");
    setUploadResetSignal((prev) => prev + 1);

    window.setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* TODO: Handle "Start Now" button click to scroll to upload section */}
      <HeroSection />
      <HowItWorks />
      <ProductDemo />
      <div ref={uploadSectionRef}>
        <UploadSection
          onAnalysisComplete={handleAnalysisComplete}
          resetSignal={uploadResetSignal}
        />
      </div>
      <AnimatePresence mode="wait">
        {analysis && (
          <motion.div
            key={analysisId || filename || "analysis-results"}
            ref={resultsSectionRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AnalysisResults
              analysis={analysis}
              filename={filename}
              onReset={handleReset}
            />
            <FollowUpChat analysisId={analysisId} />
            <SatisfactionRating />
          </motion.div>
        )}
      </AnimatePresence>
      {/* TODO: Fetch Platform Stats From Backend */}
      <PlatformStats />
      {/* TODO: Manage Recent Contracts Per User From Backend */}
      <RecentContracts />
    </div>
  );
};

export default ContractReview;
