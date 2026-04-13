import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import VerificationStep from "@/components/onboarding/VerificationStep";
import ReviewStep from "@/components/onboarding/ReviewStep";
import {
  onboardingService,
  type LawyerBasicInfo,
  type EducationData,
  type ExperienceData,
  type VerificationData,
} from "@/services/onboarding-services";
const STEPS = [
  { title: "المعلومات الأساسية", description: "بياناتك الشخصية" },
  { title: "المؤهلات", description: "الشهادات العلمية" },
  { title: "الخبرات", description: "الخبرات العملية" },
  { title: "التوثيق", description: "الهوية والترخيص" },
  { title: "المراجعة", description: "تأكيد البيانات" },
];

const DEFAULT_BASIC_INFO: LawyerBasicInfo = {
  firstName: "",
  lastName: "",
  profileImage: null,
  phoneNumber: "",
  country: "",
  city: "",
  bio: "",
  yearsOfExperience: 0,
  practiceAreas: [],
  sessionTypes: [],
};

const DEFAULT_EDUCATION: EducationData = {
  academicQualifications: [
    {
      degreeType: "",
      fieldOfStudy: "",
      universityName: "",
      graduationYear: "",
      document: null,
    },
  ],
  professionalCertifications: [],
};

const DEFAULT_EXPERIENCE: ExperienceData = {
  workExperiences: [
    {
      jobTitle: "",
      organizationName: "",
      startYear: "",
      endYear: "",
      isCurrentJob: false,
      description: "",
    },
  ],
};

const DEFAULT_VERIFICATION: VerificationData = {
  nationalIdFront: { file: null, status: "pending" },
  nationalIdBack: { file: null, status: "pending" },
  lawyerLicense: { file: null, status: "pending" },
  lawyerLicenseNumber: "",
  lawyerLicenseIssuingAuthority: "",
  lawyerLicenseYearOfIssue: "",
};

const LawyerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [savedData, setSavedData] = useState({
    education: DEFAULT_EDUCATION as EducationData,
    experience: DEFAULT_EXPERIENCE as ExperienceData,
    verification: DEFAULT_VERIFICATION as VerificationData,
  });

  const { data: progressResponse, isLoading } = useQuery({
    queryKey: ["onboarding-progress"],
    queryFn: () => onboardingService.getOnboardingProgress(),
    retry: false,
  });

  // OnSucces of useQuery is not supported in Tanstack Query v5, so we use useEffect to handle the response
  useEffect(() => {
    if (!progressResponse) return;

    if (!progressResponse.success) {
      if (progressResponse.statusCode === 404) {
        setCurrentStep(1);
        return;
      }
      toast.error("خطأ", {
        description: progressResponse.error || "فشل تحميل تقدم التسجيل",
      });
      setCurrentStep(1);
      return;
    }

    const { currentStep: savedStep, data } = progressResponse.data ?? {};
    setCurrentStep(savedStep ?? 1);
    setSavedData((prev) => ({
      basicInfo: { ...prev.basicInfo, ...data?.basicInfo },
      education: data?.education ?? prev.education,
      experience: data?.experience ?? prev.experience,
      verification: { ...prev.verification, ...data?.verification },
    }));
  }, [progressResponse]);

  // VerificationMutation
  const verificationMutation = useMutation({
    mutationFn: (data: VerificationData) =>
      onboardingService.saveVerificationDocuments(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        setSavedData((prev) => ({ ...prev, verification: variables }));
        toast.success("تم حفظ بيانات التوثيق");
        setCurrentStep(5);
      } else {
        toast.error("خطأ", {
          description: response.error || "فشل حفظ البيانات",
        });
      }
    },
    onError: () => toast.error("خطأ", { description: "فشل الاتصال بالخادم" }),
  });

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
        <OnboardingStepper currentStep={currentStep} steps={STEPS} />

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
              <VerificationStep
                defaultValues={savedData.verification}
                onNext={(data) => verificationMutation.mutate(data)}
                onBack={() => setCurrentStep(3)}
                isLoading={verificationMutation.isPending}
              />
            )}
            {currentStep === 5 && (
              <ReviewStep
                basicInfo={savedData.basicInfo}
                education={savedData.education}
                experience={savedData.experience}
                verification={savedData.verification}
                onEdit={setCurrentStep}
                onSubmit={() => {
                  setIsSubmitted(true);
                  toast.success("تم إرسال طلبك بنجاح!", {
                    description: "سيتم مراجعة بياناتك من قبل فريق الإدارة",
                  });
                }}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyerOnboarding;
