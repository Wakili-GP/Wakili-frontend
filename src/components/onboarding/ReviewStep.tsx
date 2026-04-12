import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  FileCheck,
  Edit2,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
  BookOpen,
  Medal,
  Building2,
  CalendarDays,
  IdCard,
  ShieldCheck,
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

const resolveImageSource = (value: unknown) => {
  if (value instanceof File)
    return { src: URL.createObjectURL(value), isObjectUrl: true };
  if (typeof value === "string" && value.trim())
    return { src: value, isObjectUrl: false };
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (o.file instanceof File)
      return { src: URL.createObjectURL(o.file), isObjectUrl: true };
    const url =
      o.url ??
      o.Url ??
      o.path ??
      o.fileUrl ??
      o.imageUrl ??
      o.profileImageUrl ??
      o.ProfileImageUrl;
    if (typeof url === "string" && url.trim())
      return { src: url, isObjectUrl: false };
  }
  return null;
};

const DocChip = ({ file }: { file: File | string | null | undefined }) => {
  if (!file) return null;
  const name = file instanceof File ? file.name : "المستند المرفق";
  const openPreview = () => {
    const url = file instanceof File ? URL.createObjectURL(file) : file;
    window.open(url, "_blank");
  };
  return (
    <button
      type="button"
      onClick={openPreview}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
    >
      <FileText className="w-3 h-3" />
      <span className="truncate max-w-[120px]">{name}</span>
      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
    </button>
  );
};

const ReviewCard = ({
  icon,
  title,
  step,
  onEdit,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer h-7 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
        onClick={() => onEdit(step)}
      >
        <Edit2 className="w-3 h-3" />
        تعديل
      </Button>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ReviewStep = ({
  basicInfo,
  education,
  experience,
  verification,
  onEdit,
  onSubmit,
}: ReviewStepProps) => {
  const { user } = useAuth();
  const basicInfoSource = basicInfo as LawyerBasicInfo &
    Record<string, unknown>;

  const profileImageSource = useMemo(
    () =>
      resolveImageSource(
        basicInfoSource.profileImage ??
          basicInfoSource.ProfileImage ??
          basicInfoSource.profileImageUrl ??
          basicInfoSource.ProfileImageUrl ??
          null,
      ),
    [
      basicInfoSource.profileImage,
      basicInfoSource.ProfileImage,
      basicInfoSource.profileImageUrl,
      basicInfoSource.ProfileImageUrl,
    ],
  );

  useEffect(() => {
    return () => {
      if (profileImageSource?.isObjectUrl)
        URL.revokeObjectURL(profileImageSource.src);
    };
  }, [profileImageSource]);

  const { data: specializations = [] } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => SpecializationService.getSpecializations(),
    select: (response) => response.data,
    staleTime: Infinity,
  });

  const practiceAreaNames = basicInfo.practiceAreas
    .map((id) => specializations.find((s) => s.id === id)?.name)
    .filter(Boolean) as string[];

  const docItems = [
    {
      label: "الهوية الوطنية (أمام)",
      file: verification.nationalIdFront?.file,
    },
    { label: "الهوية الوطنية (خلف)", file: verification.nationalIdBack?.file },
    { label: "رخصة المحاماة", file: verification.lawyerLicense?.file },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-1 pb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          مراجعة وتأكيد
        </h2>
        <p className="text-sm text-muted-foreground">
          راجع بياناتك بعناية قبل إرسالها للتحقق
        </p>
      </div>

      {/* Basic Info */}
      <ReviewCard
        icon={<User className="w-3.5 h-3.5 text-primary" />}
        title="المعلومات الأساسية"
        step={1}
        onEdit={onEdit}
      >
        <div className="flex items-start gap-4">
          {profileImageSource?.src ? (
            <img
              src={profileImageSource.src}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-border shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center ring-2 ring-border shrink-0">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h4 className="font-semibold text-base text-foreground">
                {[basicInfo.firstName, basicInfo.lastName]
                  .filter(Boolean)
                  .join(" ")}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                {basicInfo.phoneNumber}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {basicInfo.city}، {basicInfo.country}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              الملخص المهني
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {basicInfo.bio}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                سنوات الخبرة
              </p>
              <p className="text-sm font-medium">
                {basicInfo.yearsOfExperience} سنوات
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                نوع الجلسات
              </p>
              <div className="flex flex-wrap gap-1">
                {basicInfo.sessionTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="text-xs rounded-lg"
                  >
                    {SESSION_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              مجالات الممارسة
            </p>
            <div className="flex flex-wrap gap-1.5">
              {practiceAreaNames.map((name) => (
                <Badge
                  key={name}
                  variant="outline"
                  className="text-xs rounded-lg"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ReviewCard>

      {/* Education */}
      <ReviewCard
        icon={<GraduationCap className="w-3.5 h-3.5 text-primary" />}
        title="المؤهلات والشهادات"
        step={2}
        onEdit={onEdit}
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المؤهلات العلمية
              </p>
            </div>
            <div className="space-y-2">
              {education.academicQualifications.map((qual, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border/50"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {qual.degreeType} في {qual.fieldOfStudy}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {qual.universityName}
                          </p>
                        </div>
                        <span className="text-muted-foreground/40 text-xs">
                          •
                        </span>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {qual.graduationYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {qual.document && <DocChip file={qual.document} />}
                </div>
              ))}
            </div>
          </div>

          {education.professionalCertifications.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Medal className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    الشهادات المهنية
                  </p>
                </div>
                <div className="space-y-2">
                  {education.professionalCertifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border/50"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400/10 shrink-0 mt-0.5">
                          <Award className="w-3 h-3 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {cert.certificateName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-muted-foreground truncate">
                              {cert.issuingOrganization}
                            </p>
                            {cert.yearObtained && (
                              <>
                                <span className="text-muted-foreground/40">
                                  •
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {cert.yearObtained}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {cert.document && <DocChip file={cert.document} />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ReviewCard>

      {/* Experience */}
      <ReviewCard
        icon={<Briefcase className="w-3.5 h-3.5 text-primary" />}
        title="الخبرات العملية"
        step={3}
        onEdit={onEdit}
      >
        <div className="space-y-2">
          {experience.workExperiences.map((exp, i) => (
            <div
              key={i}
              className="relative px-4 py-3 rounded-xl bg-muted/40 border border-border/50 overflow-hidden"
            >
              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10" />
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {exp.jobTitle}
                    </p>
                    {exp.isCurrentJob && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 px-1.5 rounded-md"
                      >
                        حالي
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {exp.organizationName}
                      </p>
                    </div>
                    <span className="text-muted-foreground/40 text-xs">•</span>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {exp.isCurrentJob
                          ? `${exp.startYear} – حتى الآن`
                          : `${exp.startYear} – ${exp.endYear}`}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ReviewCard>

      {/* Verification */}
      <ReviewCard
        icon={<FileCheck className="w-3.5 h-3.5 text-primary" />}
        title="التحقق من الهوية والترخيص"
        step={4}
        onEdit={onEdit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {docItems.map(({ label, file }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${
                  file
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                {file ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                )}
                <span
                  className={`text-xs font-medium ${file ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <IdCard className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  رقم الترخيص
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums">
                {verification.lawyerLicenseNumber}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  الجهة المصدرة
                </p>
              </div>
              <p className="text-sm font-medium">
                {verification.lawyerLicenseIssuingAuthority}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  سنة الإصدار
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums">
                {verification.lawyerLicenseYearOfIssue}
              </p>
            </div>
          </div>
        </div>
      </ReviewCard>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          className="cursor-pointer rounded-xl h-10 px-5"
          onClick={() => onEdit(4)}
        >
          السابق
        </Button>
        <Button
          className="cursor-pointer rounded-xl h-10 px-6 gap-2"
          onClick={onSubmit}
        >
          <ShieldCheck className="w-4 h-4" />
          إرسال للتحقق
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
