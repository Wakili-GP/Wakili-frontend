import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import VerificationStep from "@/components/onboarding/VerificationStep";
import ReviewStep from "@/components/onboarding/ReviewStep";
import { onboardingService } from "@/services/onboarding-services";

const STEPS = [
  { title: "المعلومات الأساسية", description: "بياناتك الشخصية" },
  { title: "المؤهلات", description: "الشهادات العلمية" },
  { title: "الخبرات", description: "الخبرات العملية" },
  { title: "التوثيق", description: "الهوية والترخيص" },
  { title: "المراجعة", description: "تأكيد البيانات" },
];

const LawyerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: progressData, isLoading } = useQuery({
    queryKey: ["onboarding-progress"],
    queryFn: () => onboardingService.getOnboardingProgress(),
    select: (response) => response.data,
    retry: false,
  });

  useEffect(() => {
    const stepFromProgress = progressData?.currentStep;
    if (typeof stepFromProgress !== "number") return;

    if (stepFromProgress === -1) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setCurrentStep(Math.min(Math.max(stepFromProgress, 1), 5));
  }, [progressData?.currentStep]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل بيانات التسجيل...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        dir="rtl"
      >
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              تم إرسال طلبك بنجاح
            </h2>
            <p className="text-muted-foreground mb-6">
              شكراً لتسجيلك معنا. سيتم مراجعة بياناتك ومستنداتك من قبل فريق
              الإدارة. ستتلقى إشعاراً عند اكتمال عملية التحقق.
            </p>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mb-6">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                حالة الطلب: في انتظار التحقق
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                عادة ما تستغرق عملية المراجعة 24-48 ساعة عمل
              </p>
            </div>
            <Button onClick={() => navigate("/")}>
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedSteps = progressData?.completedSteps ?? [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">وكيلك</h1>
              <p className="text-xs text-muted-foreground">تسجيل المحامين</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <OnboardingStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          steps={STEPS}
          onStepClick={setCurrentStep}
        />

        <Card className="mt-8">
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && <BasicInfoStep onNext={setCurrentStep} />}
            {currentStep === 2 && (
              <EducationStep HandleNextBack={setCurrentStep} />
            )}
            {currentStep === 3 && (
              <ExperienceStep HandleNextBack={setCurrentStep} />
            )}
            {currentStep === 4 && (
              <VerificationStep HandleNextBack={setCurrentStep} />
            )}
            {currentStep === 5 && (
              <ReviewStep
                onEdit={setCurrentStep}
                onSubmitted={() => setIsSubmitted(true)}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyerOnboarding;
