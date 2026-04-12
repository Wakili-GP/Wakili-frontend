import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GraduationCap,
  Award,
  Loader,
  BookOpen,
  Medal,
} from "lucide-react";
import { type EducationData } from "@/services/onboarding-services";
import {
  educationSchema,
  type EducationFormData,
} from "@/schemas/onboarding.schemas";
import { DEGREE_TYPES } from "@/data/onboarding";
import FileUploadField from "@/components/FileUploadField";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);

interface EducationStepProps {
  defaultValues: EducationData;
  onNext: (data: EducationData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const FieldGroup = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

const SectionHeader = ({
  icon,
  title,
  badge,
  onAdd,
  addLabel,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: number;
  onAdd: () => void;
  addLabel: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
        {icon}
      </div>
      <span className="text-sm font-semibold text-foreground">{title}</span>
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {badge}
        </span>
      )}
    </div>
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="cursor-pointer gap-1.5 text-xs h-8 px-3 rounded-lg border-dashed hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
      onClick={onAdd}
    >
      <Plus className="w-3.5 h-3.5" />
      {addLabel}
    </Button>
  </div>
);

const EmptyState = ({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) => (
  <div
    className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
    onClick={onClick}
  >
    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
      {icon}
    </div>
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <p className="text-xs text-muted-foreground/60 mt-0.5">{subtitle}</p>
  </div>
);

const EducationStep = ({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: EducationStepProps) => {
  const src = defaultValues as EducationData & Record<string, unknown>;

  const rawAcademic = (src.academicQualifications ??
    src.AcademicQualifications ??
    []) as unknown[];
  const normalizedAcademic = (
    Array.isArray(rawAcademic) ? rawAcademic : []
  ).map((q) => {
    const o =
      typeof q === "object" && q !== null ? (q as Record<string, unknown>) : {};
    const rawDoc =
      o.document ?? o.Document ?? o.documentUrl ?? o.DocumentUrl ?? null;
    return {
      degreeType: String(o.degreeType ?? o.DegreeType ?? ""),
      fieldOfStudy: String(o.fieldOfStudy ?? o.FieldOfStudy ?? ""),
      universityName: String(o.universityName ?? o.UniversityName ?? ""),
      graduationYear: String(o.graduationYear ?? o.GraduationYear ?? ""),
      document:
        rawDoc instanceof File || typeof rawDoc === "string" ? rawDoc : null,
    };
  });

  const rawCerts = (src.professionalCertifications ??
    src.ProfessionalCertifications ??
    []) as unknown[];
  const normalizedCerts = (Array.isArray(rawCerts) ? rawCerts : []).map((c) => {
    const o =
      typeof c === "object" && c !== null ? (c as Record<string, unknown>) : {};
    const rawDoc =
      o.document ?? o.Document ?? o.documentUrl ?? o.DocumentUrl ?? null;
    return {
      certificateName: String(o.certificateName ?? o.CertificateName ?? ""),
      issuingOrganization: String(
        o.issuingOrganization ?? o.IssuingOrganization ?? "",
      ),
      yearObtained: String(o.yearObtained ?? o.YearObtained ?? ""),
      document:
        rawDoc instanceof File || typeof rawDoc === "string" ? rawDoc : null,
    };
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    values: {
      academicQualifications:
        normalizedAcademic.length > 0
          ? normalizedAcademic
          : [
              {
                degreeType: "",
                fieldOfStudy: "",
                universityName: "",
                graduationYear: "",
                document: null,
              },
            ],
      professionalCertifications: normalizedCerts,
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: "academicQualifications" });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control, name: "professionalCertifications" });

  const onSubmit = (data: EducationFormData) => onNext(data as EducationData);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          المؤهلات والشهادات
        </h2>
        <p className="text-sm text-muted-foreground">
          أضف مؤهلاتك العلمية وشهاداتك المهنية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Academic Qualifications */}
        <div className="space-y-4">
          <SectionHeader
            icon={<BookOpen className="w-4 h-4 text-primary" />}
            title="المؤهلات العلمية"
            badge={qualificationFields.length}
            onAdd={() =>
              appendQualification({
                degreeType: "",
                fieldOfStudy: "",
                universityName: "",
                graduationYear: "",
                document: null,
              })
            }
            addLabel="إضافة مؤهل"
          />

          {errors.academicQualifications?.message && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive">
                {errors.academicQualifications.message}
              </p>
            </div>
          )}

          {qualificationFields.length === 0 ? (
            <EmptyState
              icon={
                <GraduationCap className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              }
              title="لم تضف أي مؤهلات علمية بعد"
              subtitle="اضغط هنا لإضافة مؤهلك الأول"
              onClick={() =>
                appendQualification({
                  degreeType: "",
                  fieldOfStudy: "",
                  universityName: "",
                  graduationYear: "",
                  document: null,
                })
              }
            />
          ) : (
            <div className="space-y-4">
              {qualificationFields.map((field, index) => {
                const docValue = watch(
                  `academicQualifications.${index}.document`,
                );
                return (
                  <div
                    key={field.id}
                    className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20 rounded-r-full" />
                    <div className="p-5 pr-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-tight">
                              {watch(
                                `academicQualifications.${index}.degreeType`,
                              ) || "مؤهل جديد"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {watch(
                                `academicQualifications.${index}.universityName`,
                              ) || "—"}
                            </p>
                          </div>
                        </div>
                        {qualificationFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => removeQualification(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FieldGroup
                          label="نوع الدرجة *"
                          error={
                            errors.academicQualifications?.[index]?.degreeType
                              ?.message
                          }
                        >
                          <Controller
                            name={`academicQualifications.${index}.degreeType`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                dir="rtl"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 cursor-pointer transition-all focus:ring-2 focus:ring-primary ${errors.academicQualifications?.[index]?.degreeType ? "ring-destructive" : "ring-border"}`}
                                >
                                  <SelectValue placeholder="اختر نوع الدرجة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEGREE_TYPES.map((type) => (
                                    <SelectItem
                                      key={type}
                                      value={type}
                                      className="justify-end cursor-pointer"
                                    >
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="التخصص *"
                          error={
                            errors.academicQualifications?.[index]?.fieldOfStudy
                              ?.message
                          }
                        >
                          <Input
                            {...register(
                              `academicQualifications.${index}.fieldOfStudy`,
                            )}
                            placeholder="مثال: القانون التجاري"
                            className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${errors.academicQualifications?.[index]?.fieldOfStudy ? "ring-destructive" : "ring-border"}`}
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="اسم الجامعة *"
                          error={
                            errors.academicQualifications?.[index]
                              ?.universityName?.message
                          }
                        >
                          <Input
                            {...register(
                              `academicQualifications.${index}.universityName`,
                            )}
                            placeholder="اسم الجامعة"
                            className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${errors.academicQualifications?.[index]?.universityName ? "ring-destructive" : "ring-border"}`}
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="سنة التخرج *"
                          error={
                            errors.academicQualifications?.[index]
                              ?.graduationYear?.message
                          }
                        >
                          <Controller
                            name={`academicQualifications.${index}.graduationYear`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                dir="rtl"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 cursor-pointer transition-all focus:ring-2 focus:ring-primary ${errors.academicQualifications?.[index]?.graduationYear ? "ring-destructive" : "ring-border"}`}
                                >
                                  <SelectValue placeholder="اختر السنة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {YEARS.map((year) => (
                                    <SelectItem
                                      key={year}
                                      value={year}
                                      className="justify-end cursor-pointer"
                                    >
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FieldGroup>

                        <div className="md:col-span-2">
                          <FileUploadField
                            label="وثيقة المؤهل"
                            file={docValue ?? null}
                            onFile={(file) =>
                              setValue(
                                `academicQualifications.${index}.document`,
                                file,
                                { shouldValidate: true, shouldDirty: true },
                              )
                            }
                            onRemove={() =>
                              setValue(
                                `academicQualifications.${index}.document`,
                                null,
                                { shouldValidate: true, shouldDirty: true },
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-background text-xs text-muted-foreground">
              اختياري
            </span>
          </div>
        </div>

        {/* Professional Certifications */}
        <div className="space-y-4">
          <SectionHeader
            icon={<Medal className="w-4 h-4 text-primary" />}
            title="الشهادات المهنية"
            badge={certificationFields.length}
            onAdd={() =>
              appendCertification({
                certificateName: "",
                issuingOrganization: "",
                yearObtained: "",
                document: null,
              })
            }
            addLabel="إضافة شهادة"
          />

          {certificationFields.length === 0 ? (
            <EmptyState
              icon={
                <Award className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              }
              title="لم تضف أي شهادات مهنية بعد"
              subtitle="شهادات التحكيم، الامتثال، والتخصصات القانونية"
              onClick={() =>
                appendCertification({
                  certificateName: "",
                  issuingOrganization: "",
                  yearObtained: "",
                  document: null,
                })
              }
            />
          ) : (
            <div className="space-y-4">
              {certificationFields.map((field, index) => {
                const docValue = watch(
                  `professionalCertifications.${index}.document`,
                );
                return (
                  <div
                    key={field.id}
                    className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-linear-to-b from-amber-400/60 to-amber-400/20 rounded-r-full" />
                    <div className="p-5 pr-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400/10 shrink-0">
                            <Medal className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-tight">
                              {watch(
                                `professionalCertifications.${index}.certificateName`,
                              ) || "شهادة جديدة"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {watch(
                                `professionalCertifications.${index}.issuingOrganization`,
                              ) || "—"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => removeCertification(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FieldGroup
                          label="اسم الشهادة *"
                          error={
                            errors.professionalCertifications?.[index]
                              ?.certificateName?.message
                          }
                        >
                          <Input
                            {...register(
                              `professionalCertifications.${index}.certificateName`,
                            )}
                            placeholder="مثال: شهادة التحكيم التجاري الدولي"
                            className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${errors.professionalCertifications?.[index]?.certificateName ? "ring-destructive" : "ring-border"}`}
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="الجهة المانحة *"
                          error={
                            errors.professionalCertifications?.[index]
                              ?.issuingOrganization?.message
                          }
                        >
                          <Input
                            {...register(
                              `professionalCertifications.${index}.issuingOrganization`,
                            )}
                            placeholder="اسم المنظمة أو الجهة"
                            className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${errors.professionalCertifications?.[index]?.issuingOrganization ? "ring-destructive" : "ring-border"}`}
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="سنة الحصول *"
                          error={
                            errors.professionalCertifications?.[index]
                              ?.yearObtained?.message
                          }
                        >
                          <Controller
                            name={`professionalCertifications.${index}.yearObtained`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                dir="rtl"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 cursor-pointer transition-all focus:ring-2 focus:ring-primary ${errors.professionalCertifications?.[index]?.yearObtained ? "ring-destructive" : "ring-border"}`}
                                >
                                  <SelectValue placeholder="اختر السنة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {YEARS.map((year) => (
                                    <SelectItem
                                      key={year}
                                      value={year}
                                      className="justify-end cursor-pointer"
                                    >
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FieldGroup>

                        <div className="md:col-span-2">
                          <FileUploadField
                            label="المستند"
                            file={docValue ?? null}
                            onFile={(file) =>
                              setValue(
                                `professionalCertifications.${index}.document`,
                                file,
                                { shouldValidate: true, shouldDirty: true },
                              )
                            }
                            onRemove={() =>
                              setValue(
                                `professionalCertifications.${index}.document`,
                                null,
                                { shouldValidate: true, shouldDirty: true },
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-xl h-10 px-5"
            onClick={onBack}
          >
            السابق
          </Button>
          <Button
            type="submit"
            className="cursor-pointer rounded-xl h-10 px-6 gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            التالي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EducationStep;
