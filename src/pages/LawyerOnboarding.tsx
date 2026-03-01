import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import VerificationStep from "@/components/onboarding/VerificationStep";
import ReviewStep from "@/components/onboarding/ReviewStep";
import { lawyerService } from "@/services/onboarding-services";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "المعلومات الأساسية", description: "بياناتك الشخصية" },
  { title: "المؤهلات", description: "الشهادات العلمية" },
  { title: "الخبرات", description: "الخبرات العملية" },
  { title: "التوثيق", description: "الهوية والترخيص" },
  { title: "المراجعة", description: "تأكيد البيانات" },
];

const LawyerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    profileImage: null as string | null,
    phoneCode: "+20",
    phoneNumber: "",
    country: "",
    city: "",
    bio: "",
    yearsOfExperience: "",
    practiceAreas: [] as number[], // Stores specialization IDs
    sessionTypes: [] as string[],
  });

  // Update email in basicInfo when user email changes
  // useEffect(() => {
  //   if (user?.email) {
  //     setBasicInfo((prev) => ({ ...prev, email: user.email }));
  //   }
  // }, [user?.email]);

  // Step 2: Education
  const [education, setEducation] = useState({
    academicQualifications: [
      {
        id: "1",
        degreeType: "",
        fieldOfStudy: "",
        universityName: "",
        graduationYear: "",
      },
    ],
    professionalCertifications: [] as {
      id: string;
      certificateName: string;
      issuingOrganization: string;
      yearObtained: string;
      document: string | null;
    }[],
  });

  // Step 3: Experience
  const [experience, setExperience] = useState({
    workExperiences: [
      {
        id: "1",
        jobTitle: "",
        organizationName: "",
        startYear: "",
        endYear: "",
        isCurrentJob: false,
        description: "",
      },
    ],
  });

  // Step 4: Verification
  const [verification, setVerification] = useState<{
    nationalIdFront: {
      file: string | null;
      fileName: string | null;
      status: "pending" | "uploaded";
    };
    nationalIdBack: {
      file: string | null;
      fileName: string | null;
      status: "pending" | "uploaded";
    };
    lawyerLicense: {
      file: string | null;
      fileName: string | null;
      status: "pending" | "uploaded";
    };
    educationalCertificates: {
      file: string | null;
      fileName: string | null;
      status: "pending" | "uploaded";
    }[];
    professionalCertificates: {
      file: string | null;
      fileName: string | null;
      status: "pending" | "uploaded";
    }[];
    licenseNumber: string;
    issuingAuthority: string;
    yearOfIssue: string;
  }>({
    nationalIdFront: { file: null, fileName: null, status: "pending" },
    nationalIdBack: { file: null, fileName: null, status: "pending" },
    lawyerLicense: { file: null, fileName: null, status: "pending" },
    educationalCertificates: [
      { file: null, fileName: null, status: "pending" },
    ],
    professionalCertificates: [],
    licenseNumber: "",
    issuingAuthority: "",
    yearOfIssue: "",
  });

  // Fetch onboarding progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoadingProgress(true);

      // Store userId for API requests
      if (user?.id) {
        localStorage.setItem("userId", user.id);
      }

      const response = await lawyerService.getOnboardingProgress();
      if (response.success && response.data) {
        // Load saved data from progress
        const { currentStep: savedStep, data: savedData } = response.data;
        setCurrentStep(savedStep);

        if (savedData.basicInfo) {
          setBasicInfo((prev) => ({ ...prev, ...savedData.basicInfo }));
        }
        if (savedData.education) {
          setEducation(savedData.education);
        }
        if (savedData.experience) {
          setExperience(savedData.experience);
        }
        if (savedData.verification) {
          setVerification((prev) => ({ ...prev, ...savedData.verification }));
        }
      }
      setIsLoadingProgress(false);
    };

    fetchProgress();
  }, [user?.id]);

  // Save basic info step to backend
  const handleBasicInfoNext = async () => {
    const response = await lawyerService.saveBasicInfo(basicInfo);
    if (response.success) {
      toast.success("تم حفظ المعلومات", {
        description: "سيتم الانتقال للخطوة التالية",
      });
      setCurrentStep(2);
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل حفظ البيانات",
      });
    }
  };

  // Save education step to backend
  const handleEducationNext = async () => {
    const response = await lawyerService.saveEducation(education);
    if (response.success) {
      toast.success("تم حفظ المؤهلات", {
        description: "سيتم الانتقال للخطوة التالية",
      });
      setCurrentStep(3);
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل حفظ البيانات",
      });
    }
  };

  // Save experience step to backend
  const handleExperienceNext = async () => {
    const response = await lawyerService.saveExperience(experience);
    if (response.success) {
      toast.success("تم حفظ الخبرات", {
        description: "سيتم الانتقال للخطوة التالية",
      });
      setCurrentStep(4);
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل حفظ البيانات",
      });
    }
  };

  // Save verification step to backend
  const handleVerificationNext = async () => {
    const response =
      await lawyerService.uploadVerificationDocuments(verification);
    if (response.success) {
      toast.success("تم حفظ المستندات", {
        description: "سيتم الانتقال للخطوة التالية",
      });
      setCurrentStep(5);
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل حفظ المستندات",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Note: In the new API, submission happens gradually as each step is saved
    // This just confirms completion
    const response = await lawyerService.submitOnboarding();

    if (response.success) {
      setIsSubmitting(false);
      setIsSubmitted(true);

      toast.success("تم إرسال طلبك بنجاح!", {
        description: "سيتم مراجعة بياناتك من قبل فريق الإدارة",
      });
    } else {
      setIsSubmitting(false);
      toast.error("خطأ", {
        description: response.error || "فشل إرسال الطلب",
      });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

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
            <Button onClick={() => navigate("/")} className="cursor-pointer">
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل بيانات التسجيل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stepper */}
        <OnboardingStepper currentStep={currentStep} steps={steps} />

        {/* Step Content */}
        <Card className="mt-8">
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && (
              <BasicInfoStep
                data={basicInfo}
                onChange={setBasicInfo}
                onNext={handleBasicInfoNext}
              />
            )}

            {currentStep === 2 && (
              <EducationStep
                data={education}
                onChange={setEducation}
                onNext={handleEducationNext}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <ExperienceStep
                data={experience}
                onChange={setExperience}
                onNext={handleExperienceNext}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <VerificationStep
                data={verification}
                onChange={setVerification}
                onNext={handleVerificationNext}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <ReviewStep
                basicInfo={basicInfo}
                education={education}
                experience={experience}
                verification={verification}
                onEdit={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyerOnboarding;
