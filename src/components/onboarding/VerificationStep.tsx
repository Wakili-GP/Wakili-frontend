import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Trash2,
  IdCard,
  Award,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type VerificationData } from "@/services/onboarding-services";
import {
  verificationSchema,
  type VerificationFormData,
} from "@/schemas/onboarding.schemas";

import { YEARS, EMPTY_DOC } from "@/data/onboarding";

interface VerificationStepProps {
  defaultValues: VerificationData;
  onNext: (data: VerificationData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const VerificationStep = ({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: VerificationStepProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      nationalIdFront: defaultValues.nationalIdFront,
      nationalIdBack: defaultValues.nationalIdBack,
      lawyerLicense: defaultValues.lawyerLicense,
      lawyerLicenseNumber: defaultValues.lawyerLicenseNumber,
      lawyerLicenseIssuingAuthority:
        defaultValues.lawyerLicenseIssuingAuthority,
      lawyerLicenseYearOfIssue: defaultValues.lawyerLicenseYearOfIssue,
      educationalCertificates: defaultValues.educationalCertificates.length
        ? defaultValues.educationalCertificates
        : [EMPTY_DOC],
      professionalCertificates: defaultValues.professionalCertificates ?? [],
    },
  });

  const {
    fields: eduFields,
    append: appendEdu,
    update: updateEdu,
  } = useFieldArray({ control, name: "educationalCertificates" });

  const {
    fields: profFields,
    append: appendProf,
    update: updateProf,
  } = useFieldArray({ control, name: "professionalCertificates" });

  const onSubmit = (data: VerificationFormData) => {
    onNext(data as VerificationData);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFile: (file: File) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const UploadBox = ({
    label,
    icon,
    file,
    error,
    onFile,
    onRemove,
  }: {
    label: string;
    icon: React.ReactNode;
    file: File | null;
    error?: string;
    onFile: (file: File) => void;
    onRemove: () => void;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      {file ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
          <CheckCircle className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">تم الرفع بنجاح</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${error ? "border-destructive" : "border-border"}`}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            اضغط لرفع ملف <br />
            <span className="text-xs">PDF أو صورة</span>
          </p>
          <input
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, onFile)}
          />
        </label>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );

  const nationalIdFront = watch("nationalIdFront.file");
  const nationalIdBack = watch("nationalIdBack.file");
  const lawyerLicense = watch("lawyerLicense.file");

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          التحقق من الهوية والترخيص
        </h2>
        <p className="text-muted-foreground mt-1">
          ارفع المستندات المطلوبة للتحقق من هويتك وترخيصك المهني
        </p>
      </div>

      <Alert className="bg-amber-500/10 border-amber-500/20">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          يتم مراجعة المستندات من قبل فريق الإدارة. لن يظهر ملفك الشخصي للعملاء
          حتى تتم الموافقة على التوثيق.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* National ID */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">الهوية الوطنية *</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UploadBox
                label="الوجه الأمامي"
                icon={<FileText className="w-4 h-4" />}
                file={nationalIdFront ?? null}
                error={errors.nationalIdFront?.message}
                onFile={(file) =>
                  setValue(
                    "nationalIdFront",
                    { file, status: "uploaded" },
                    { shouldValidate: true },
                  )
                }
                onRemove={() =>
                  setValue("nationalIdFront", EMPTY_DOC, {
                    shouldValidate: true,
                  })
                }
              />
              <UploadBox
                label="الوجه الخلفي"
                icon={<FileText className="w-4 h-4" />}
                file={nationalIdBack ?? null}
                error={errors.nationalIdBack?.message}
                onFile={(file) =>
                  setValue(
                    "nationalIdBack",
                    { file, status: "uploaded" },
                    { shouldValidate: true },
                  )
                }
                onRemove={() =>
                  setValue("nationalIdBack", EMPTY_DOC, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Lawyer License */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">رخصة المحاماة *</h3>
            </div>

            <UploadBox
              label="رخصة المحاماة / كارنيه النقابة"
              icon={<FileText className="w-4 h-4" />}
              file={lawyerLicense ?? null}
              error={errors.lawyerLicense?.message}
              onFile={(file) =>
                setValue(
                  "lawyerLicense",
                  { file, status: "uploaded" },
                  { shouldValidate: true },
                )
              }
              onRemove={() =>
                setValue("lawyerLicense", EMPTY_DOC, { shouldValidate: true })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label>رقم الترخيص *</Label>
                <Input
                  {...register("lawyerLicenseNumber")}
                  placeholder="رقم القيد بالنقابة"
                  className={
                    errors.lawyerLicenseNumber ? "border-destructive" : ""
                  }
                />
                {errors.lawyerLicenseNumber && (
                  <p className="text-sm text-destructive">
                    {errors.lawyerLicenseNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>الجهة المصدرة *</Label>
                <Input
                  {...register("lawyerLicenseIssuingAuthority")}
                  placeholder="مثال: نقابة المحامين"
                  className={
                    errors.lawyerLicenseIssuingAuthority
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors.lawyerLicenseIssuingAuthority && (
                  <p className="text-sm text-destructive">
                    {errors.lawyerLicenseIssuingAuthority.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>سنة الإصدار *</Label>
                <Controller
                  name="lawyerLicenseYearOfIssue"
                  control={control}
                  render={({ field }) => (
                    <Select
                      dir="rtl"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`cursor-pointer ${errors.lawyerLicenseYearOfIssue ? "border-destructive" : ""}`}
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
                {errors.lawyerLicenseYearOfIssue && (
                  <p className="text-sm text-destructive">
                    {errors.lawyerLicenseYearOfIssue.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Certificates */}
        <Card
          className={`border-border ${errors.educationalCertificates ? "border-destructive" : ""}`}
        >
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  الشهادات العلمية <span className="text-destructive">*</span>
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => appendEdu(EMPTY_DOC)}
              >
                إضافة شهادة
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              يجب رفع شهادة علمية واحدة على الأقل (شهادة البكالوريوس أو أعلى)
            </p>
            {errors.educationalCertificates?.message && (
              <p className="text-sm text-destructive">
                {errors.educationalCertificates.message}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eduFields.map((field, index) => {
                const file = watch(`educationalCertificates.${index}.file`);
                return (
                  <UploadBox
                    key={field.id}
                    label={`الشهادة ${index + 1}`}
                    icon={<FileText className="w-4 h-4" />}
                    file={file ?? null}
                    error={
                      errors.educationalCertificates?.[index]?.file?.message
                    }
                    onFile={(f) =>
                      updateEdu(index, { file: f, status: "uploaded" })
                    }
                    onRemove={() => updateEdu(index, EMPTY_DOC)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Professional Certificates */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  الشهادات المهنية (اختياري)
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => appendProf(EMPTY_DOC)}
              >
                إضافة شهادة
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profFields.map((field, index) => {
                const file = watch(`professionalCertificates.${index}.file`);
                return (
                  <UploadBox
                    key={field.id}
                    label={`الشهادة ${index + 1}`}
                    icon={<FileText className="w-4 h-4" />}
                    file={file ?? null}
                    onFile={(f) =>
                      updateProf(index, { file: f, status: "uploaded" })
                    }
                    onRemove={() => updateProf(index, EMPTY_DOC)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onBack}
          >
            السابق
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading && <Loader className="w-4 h-4 animate-spin ml-2" />}
            التالي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerificationStep;
