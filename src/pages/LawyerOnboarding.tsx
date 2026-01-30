import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { Scale, Clock, Euro } from "lucide-react";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import EducationStep from "@/components/onboarding/EducationStep";
const steps = [
  { title: "المعلومات الأساسية", description: "بياناتك الشخصية" },
  { title: "المؤهلات", description: "الشهادات العلمية" },
  { title: "الخبرات", description: "الخبرات العملية" },
  { title: "التوثيق", description: "الهوية والترخيص" },
  { title: "المراجعة", description: "تأكيد البيانات" },
];
const LawyerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(2);
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
        <OnboardingStepper currentStep={currentStep} steps={steps} />
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
export default LawyerOnboarding;
