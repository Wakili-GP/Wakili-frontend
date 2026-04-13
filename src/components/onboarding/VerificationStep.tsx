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
import onboardingService, {
  type VerificationData,
  type OnboardingProgress,
  type ApiResponse,
} from "@/services/onboarding-services";
import {
  verificationSchema,
  type VerificationFormData,
} from "@/schemas/onboarding.schemas";
import { YEARS } from "@/data/onboarding";
import FileUploadField from "@/components/FileUploadField";
import { toast } from "../ui/sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VerificationStepProps {
  HandleNextBack: (step: number) => void;
}

const VerificationStep = ({ HandleNextBack }: VerificationStepProps) => {
  const queryClient = useQueryClient();

  // Read synchronously from cache so defaultValues are populated before first render
  const cached = queryClient.getQueryData<ApiResponse<OnboardingProgress>>([
    "onboarding-progress",
  ]);
  const cachedLicense = cached?.data?.data.verification?.lawyerLicense;

  const verificationMutation = useMutation({
    mutationFn: (data: VerificationData) =>
      onboardingService.saveVerificationDocuments(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("تم حفظ بيانات التوثيق");
        HandleNextBack(5);
      } else {
        toast.error("خطأ", {
          description: response.error || "فشل حفظ البيانات",
        });
      }
    },
    onError: () => toast.error("خطأ", { description: "فشل الاتصال بالخادم" }),
  });

  // Keep the query alive so other steps stay in sync, but we don't use its data here
  useQuery({
    queryKey: ["onboarding-progress"],
    queryFn: () => onboardingService.getOnboardingProgress(),
    retry: false,
  });

  const cachedVerification = cached?.data?.data.verification;

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
      nationalIdFront: cachedVerification?.nationalIdFront ?? null,
      nationalIdBack: cachedVerification?.nationalIdBack ?? null,
      lawyerLicense: cachedLicense?.licensePath ?? null,
      lawyerLicenseNumber: cachedLicense?.licenseNumber ?? "",
      lawyerLicenseIssuingAuthority: cachedLicense?.issuingAuthority ?? "",
      lawyerLicenseYearOfIssue: cachedLicense?.licenseYear ?? "",
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    verificationMutation.mutate(data as VerificationData);
  };

  const nationalIdFront = watch("nationalIdFront");
  const nationalIdBack = watch("nationalIdBack");
  const lawyerLicense = watch("lawyerLicense");

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
                  setValue("nationalIdFront", file, { shouldValidate: true })
                }
                onRemove={() =>
                  setValue("nationalIdFront", null, { shouldValidate: true })
                }
              />
              <FileUploadField
                label="الوجه الخلفي"
                file={nationalIdBack ?? null}
                error={errors.nationalIdBack?.message}
                onFile={(file) =>
                  setValue("nationalIdBack", file, { shouldValidate: true })
                }
                onRemove={() =>
                  setValue("nationalIdBack", null, { shouldValidate: true })
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
                setValue("lawyerLicense", file, { shouldValidate: true })
              }
              onRemove={() =>
                setValue("lawyerLicense", null, { shouldValidate: true })
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
            onClick={() => HandleNextBack(3)}
          >
            السابق
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={verificationMutation.isPending}
          >
            {verificationMutation.isPending && (
              <Loader className="w-4 h-4 animate-spin ml-2" />
            )}
            التالي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerificationStep;
