import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
import ExperienceStep from "@/components/onboarding/ExperienceStep";
import VerificationStep from "@/components/onboarding/VerificationStep";
import ReviewStep from "@/components/onboarding/ReviewStep";

const steps = [
  { title: "المعلومات الأساسية", description: "بياناتك الشخصية" },
  { title: "المؤهلات", description: "الشهادات العلمية" },
  { title: "الخبرات", description: "الخبرات العملية" },
  { title: "التوثيق", description: "الهوية والترخيص" },
  { title: "المراجعة", description: "تأكيد البيانات" },
];

const LawyerOnboarding = () => {
  // const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "lawyer@example.com", // This would come from registration
    profileImage: null as string | null,
    phoneCode: "+20",
    phoneNumber: "",
    country: "",
    city: "",
    bio: "",
    yearsOfExperience: "",
    practiceAreas: [] as string[],
    sessionTypes: [] as string[],
  });

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast.success("تم إرسال طلبك بنجاح!", {
      description: "سيتم مراجعة بياناتك من قبل فريق الإدارة",
    });
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
            <button
              // onClick={() => navigate("/")}
              className="text-primary hover:underline text-sm"
            >
              العودة للصفحة الرئيسية
            </button>
          </CardContent>
        </Card>
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
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <EducationStep
                data={education}
                onChange={setEducation}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <ExperienceStep
                data={experience}
                onChange={setExperience}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <VerificationStep
                data={verification}
                onChange={setVerification}
                onNext={() => setCurrentStep(5)}
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
