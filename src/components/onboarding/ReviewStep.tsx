import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  FileCheck,
  Edit,
  CheckCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { categoriesService } from "@/services/categories-services";

interface ReviewStepProps {
  basicInfo: {
    fullName: string;
    email: string;
    profileImage: string | null;
    phoneCode: string;
    phoneNumber: string;
    country: string;
    city: string;
    bio: string;
    yearsOfExperience: string;
    practiceAreas: number[]; // Stores specialization IDs
    sessionTypes: string[];
  };
  education: {
    academicQualifications: {
      id: string;
      degreeType: string;
      fieldOfStudy: string;
      universityName: string;
      graduationYear: string;
    }[];
    professionalCertifications: {
      id: string;
      certificateName: string;
      issuingOrganization: string;
      yearObtained: string;
      document: string | null;
    }[];
  };
  experience: {
    workExperiences: {
      id: string;
      jobTitle: string;
      organizationName: string;
      startYear: string;
      endYear: string;
      isCurrentJob: boolean;
      description: string;
    }[];
  };
  verification: {
    nationalIdFront: { file: string | null; fileName: string | null };
    nationalIdBack: { file: string | null; fileName: string | null };
    lawyerLicense: { file: string | null; fileName: string | null };
    licenseNumber: string;
    issuingAuthority: string;
    yearOfIssue: string;
  };
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const sessionTypeLabels: Record<string, string> = {
  office: "استشارة مكتبية",
  phone: "استشارة هاتفية",
};

const ReviewStep = ({
  basicInfo,
  education,
  experience,
  verification,
  onEdit,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) => {
  const [practiceAreaNames, setPracticeAreaNames] = useState<string[]>([]);

  // Convert practiceArea IDs to names
  useEffect(() => {
    const fetchNames = async () => {
      const response = await categoriesService.getActiveSpecializations();
      if (response.success && response.data) {
        const names = basicInfo.practiceAreas
          .map((id) => {
            const spec = response.data.find((s) => s.id === id);
            return spec?.name || "";
          })
          .filter(Boolean);
        setPracticeAreaNames(names);
      }
    };

    if (basicInfo.practiceAreas.length > 0) {
      fetchNames();
    }
  }, [basicInfo.practiceAreas]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">مراجعة وتأكيد</h2>
        <p className="text-muted-foreground mt-1">
          راجع بياناتك قبل إرسالها للتحقق
        </p>
      </div>

      {/* Basic Info Summary */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            المعلومات الأساسية
          </CardTitle>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            {basicInfo.profileImage && (
              <img
                src={basicInfo.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{basicInfo.fullName}</h3>
              <p className="text-sm text-muted-foreground">{basicInfo.email}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {basicInfo.phoneCode} {basicInfo.phoneNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {basicInfo.city}، {basicInfo.country}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">الملخص المهني</p>
            <p className="text-sm text-muted-foreground">{basicInfo.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">سنوات الخبرة</p>
              <p className="text-sm text-muted-foreground">
                {basicInfo.yearsOfExperience} سنوات
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">نوع الجلسات</p>
              <div className="flex flex-wrap gap-1">
                {basicInfo.sessionTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {sessionTypeLabels[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">مجالات الممارسة</p>
            <div className="flex flex-wrap gap-1">
              {practiceAreaNames.map((name, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Summary */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            المؤهلات والشهادات
          </CardTitle>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(2)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">المؤهلات العلمية</p>
            <div className="space-y-2">
              {education.academicQualifications.map((qual) => (
                <div key={qual.id} className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {qual.degreeType} في {qual.fieldOfStudy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {qual.universityName} • {qual.graduationYear}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {education.professionalCertifications.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">الشهادات المهنية</p>
                <div className="space-y-2">
                  {education.professionalCertifications.map((cert) => (
                    <div key={cert.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <p className="font-medium">{cert.certificateName}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuingOrganization} • {cert.yearObtained}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Experience Summary */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            الخبرات العملية
          </CardTitle>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(3)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {experience.workExperiences.map((exp) => (
              <div key={exp.id} className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{exp.jobTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.organizationName} •{" "}
                  {exp.isCurrentJob
                    ? `${exp.startYear} - حتى الآن`
                    : `${exp.startYear} - ${exp.endYear}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Summary */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            التحقق من الهوية والترخيص
          </CardTitle>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(4)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm">الهوية الوطنية (أمام)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm">الهوية الوطنية (خلف)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm">رخصة المحاماة</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">رقم الترخيص</p>
              <p className="text-sm text-muted-foreground">
                {verification.licenseNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">الجهة المصدرة</p>
              <p className="text-sm text-muted-foreground">
                {verification.issuingAuthority}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">سنة الإصدار</p>
              <p className="text-sm text-muted-foreground">
                {verification.yearOfIssue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => onEdit(4)}
        >
          السابق
        </Button>
        <Button
          className="cursor-pointer"
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال للتحقق"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
