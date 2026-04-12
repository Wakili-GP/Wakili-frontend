import { useForm, Controller } from "react-hook-form";
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
import { IdCard, Award, AlertTriangle, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type VerificationData } from "@/services/onboarding-services";
import {
  verificationSchema,
  type VerificationFormData,
} from "@/schemas/onboarding.schemas";
import { YEARS, EMPTY_DOC } from "@/data/onboarding";
import FileUploadField from "@/components/FileUploadField";

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
    values: {
      nationalIdFront: defaultValues.nationalIdFront,
      nationalIdBack: defaultValues.nationalIdBack,
      lawyerLicense: defaultValues.lawyerLicense,
      lawyerLicenseNumber: defaultValues.lawyerLicenseNumber,
      lawyerLicenseIssuingAuthority:
        defaultValues.lawyerLicenseIssuingAuthority,
      lawyerLicenseYearOfIssue: defaultValues.lawyerLicenseYearOfIssue,
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    onNext(data as VerificationData);
  };

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
              <FileUploadField
                label="الوجه الأمامي"
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
              <FileUploadField
                label="الوجه الخلفي"
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

            <FileUploadField
              label="رخصة المحاماة / كارنيه النقابة"
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
