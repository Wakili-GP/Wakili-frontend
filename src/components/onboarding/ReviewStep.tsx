import { useQuery } from "@tanstack/react-query";
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
import SpecializationService from "@/services/specializations-services";
import type {
  LawyerBasicInfo,
  EducationData,
  ExperienceData,
  VerificationData,
} from "@/services/onboarding-services";
import { useAuth } from "@/stores/auth.store";
import { SESSION_TYPE_LABELS } from "@/data/onboarding";

interface ReviewStepProps {
  basicInfo: LawyerBasicInfo;
  education: EducationData;
  experience: ExperienceData;
  verification: VerificationData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}

const ReviewStep = ({
  basicInfo,
  education,
  experience,
  verification,
  onEdit,
  onSubmit,
}: ReviewStepProps) => {
  const { user } = useAuth();

  // Hits cache — BasicInfoStep already fetched this
  const { data: specializations = [] } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => SpecializationService.getSpecializations(),
    select: (response) => response.data,
    staleTime: Infinity,
  });

  const practiceAreaNames = basicInfo.practiceAreas
    .map((id) => specializations.find((s) => s.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">مراجعة وتأكيد</h2>
        <p className="text-muted-foreground mt-1">
          راجع بياناتك قبل إرسالها للتحقق
        </p>
      </div>

      {/* Basic Info */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            المعلومات الأساسية
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
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
                src={URL.createObjectURL(basicInfo.profileImage)}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                    {SESSION_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">مجالات الممارسة</p>
            <div className="flex flex-wrap gap-1">
              {practiceAreaNames.map((name) => (
                <Badge key={name} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            المؤهلات والشهادات
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
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
              {education.academicQualifications.map((qual, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg">
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
                  {education.professionalCertifications.map((cert, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
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

      {/* Experience */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            الخبرات العملية
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => onEdit(3)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {experience.workExperiences.map((exp, i) => (
              <div key={i} className="p-3 bg-muted rounded-lg">
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

      {/* Verification */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            التحقق من الهوية والترخيص
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => onEdit(4)}
          >
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "الهوية الوطنية (أمام)",
                uploaded: !!verification.nationalIdFront.file,
              },
              {
                label: "الهوية الوطنية (خلف)",
                uploaded: !!verification.nationalIdBack.file,
              },
              {
                label: "رخصة المحاماة",
                uploaded: !!verification.lawyerLicense.file,
              },
            ].map(({ label, uploaded }) => (
              <div key={label} className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${uploaded ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">رقم الترخيص</p>
              <p className="text-sm text-muted-foreground">
                {verification.lawyerLicenseNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">الجهة المصدرة</p>
              <p className="text-sm text-muted-foreground">
                {verification.lawyerLicenseIssuingAuthority}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">سنة الإصدار</p>
              <p className="text-sm text-muted-foreground">
                {verification.lawyerLicenseYearOfIssue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => onEdit(4)}
        >
          السابق
        </Button>
        <Button size="lg" className="cursor-pointer" onClick={onSubmit}>
          إرسال للتحقق
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
