import { useState } from "react";
import { z } from "zod";
import {
  basicInfoSchema,
  type BasicInfoFormData,
} from "@/schemas/onboarding.schemas";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, X, Upload, Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import SpecializationService, {
  type Specialization,
} from "@/services/specializations-services";
import { type ApiResponse } from "@/services/api/httpClient";
import { type LawyerBasicInfo } from "@/services/onboarding-services";
import { useAuth } from "@/stores/auth.store";
import {
  SESSION_TYPE_OPTIONS,
  COUNTRIES,
  CITIES_BY_COUNTRY,
  PHONE_CODES,
} from "@/data/onboarding";

interface BasicInfoStepProps {
  defaultValues: LawyerBasicInfo;
  onNext: (data: LawyerBasicInfo) => void;
  isLoading: boolean;
}

const BasicInfoStep = ({
  defaultValues,
  onNext,
  isLoading,
}: BasicInfoStepProps) => {
  const { user } = useAuth();

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const { data: specializations = [], isLoading: isLoadingSpecializations } =
    useQuery<ApiResponse<Specialization[]>, Error, Specialization[]>({
      queryKey: ["specializations"],
      queryFn: () => SpecializationService.getSpecializations(),
      select: (response) => response.data ?? [],
    });

  // Form Data
  // React Hook Form allows 3 types
  // 1.TFieldValues: Shape of data it received before validation
  // 2.TContext: Type of context object passed to resolver (not used here)
  // 3.TOutput: Shape of data after validation (what we get in onSubmit)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<
    z.input<typeof basicInfoSchema>,
    undefined,
    z.output<typeof basicInfoSchema>
  >({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      profileImage: defaultValues.profileImage || null,
      phoneCode: defaultValues.phoneCode || "",
      phoneNumber: defaultValues.phoneNumber || "",
      country: defaultValues.country || "",
      city: defaultValues.city || "",
      bio: defaultValues.bio || "",
      yearsOfExperience: defaultValues.yearsOfExperience || 0,
      practiceAreas: defaultValues.practiceAreas || [],
      sessionTypes: defaultValues.sessionTypes || [],
    },
  });

  const watchedCountry = watch("country");
  const watchedBio = watch("bio");
  const watchedProfileImage = watch("profileImage");
  const watchedPracticeAreas = watch("practiceAreas");
  const watchedSessionTypes = watch("sessionTypes");

  const onSubmit = (data: BasicInfoFormData) => {
    onNext(data); // BasicInfoMutation
  };

  const confirmImage = () => {
    if (previewFile) {
      setValue("profileImage", previewFile, { shouldValidate: true });
      setImageDialogOpen(false);
      setPreviewFile(null);
    }
  };

  const togglePracticeArea = (id: number) => {
    const current = watchedPracticeAreas || [];
    setValue(
      "practiceAreas",
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  const toggleSessionType = (id: string) => {
    const current = watchedSessionTypes || [];
    setValue(
      "sessionTypes",
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          المعلومات الأساسية
        </h2>
        <p className="text-muted-foreground mt-1">
          أكمل معلوماتك الشخصية والمهنية
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* {" Profile Image "} */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className={`w-28 h-28 rounded-full border-4 ${
                errors.profileImage ? "border-destructive" : "border-primary/20"
              } overflow-hidden bg-muted flex items-center justify-center cursor-pointer`}
              onClick={() => setImageDialogOpen(true)}
            >
              {watchedProfileImage ? (
                <img
                  src={URL.createObjectURL(watchedProfileImage)}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="cursor-pointer w-4 h-4" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setImageDialogOpen(true)}
              className="absolute bottom-0 left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
            >
              <Camera className="cursor-pointer w-4 h-4" />
            </button>
          </div>
          {errors.profileImage && (
            <p className="text-sm text-destructive">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name — from auth, disabled */}
          <div className="space-y-2">
            <Label>الاسم الأول</Label>
            <Input
              value={user?.firstName ?? ""}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Last Name — from auth, disabled */}
          <div className="space-y-2">
            <Label>الاسم الأخير</Label>
            <Input value={user?.lastName ?? ""} disabled className="bg-muted" />
          </div>

          {/* Email — from auth, disabled */}
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input value={user?.email ?? ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              لا يمكن تغيير البريد الإلكتروني
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>رقم الهاتف *</Label>
            <div className="flex gap-2">
              <Controller
                name="phoneCode"
                control={control}
                render={({ field }) => (
                  <Select
                    dir="rtl"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="cursor-pointer w-36 text-right">
                      <SelectValue placeholder="الكود" />
                    </SelectTrigger>
                    <SelectContent align="end" className="w-36">
                      {PHONE_CODES.map((item) => (
                        <SelectItem
                          key={item.code}
                          value={item.code}
                          className="justify-end cursor-pointer"
                        >
                          {item.country} {item.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                {...register("phoneNumber")}
                placeholder="رقم الهاتف"
                className={`flex-1 ${errors.phoneNumber ? "border-destructive" : ""}`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">سنوات الخبرة *</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min={0}
              max={60}
              {...register("yearsOfExperience")}
              placeholder="عدد سنوات الخبرة"
              className={errors.yearsOfExperience ? "border-destructive" : ""}
            />
            {errors.yearsOfExperience && (
              <p className="text-sm text-destructive">
                {errors.yearsOfExperience.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label>الدولة *</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("city", "", { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    className={`cursor-pointer ${errors.country ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {COUNTRIES.map((country) => (
                      <SelectItem
                        key={country}
                        value={country}
                        className="cursor-pointer justify-end"
                      >
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-sm text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label>المدينة *</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!watchedCountry}
                >
                  <SelectTrigger
                    className={errors.city ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {(CITIES_BY_COUNTRY[watchedCountry] ?? []).map((city) => (
                      <SelectItem
                        key={city}
                        value={city}
                        className="justify-end cursor-pointer"
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">الملخص المهني * (100 حرف على الأقل)</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="اكتب نبذة مختصرة عن خبراتك ومجالات تخصصك..."
            className={`min-h-[120px] ${errors.bio ? "border-destructive" : ""}`}
          />
          <div className="flex justify-between">
            <p
              className={`text-xs ${(watchedBio?.length ?? 0) < 100 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {watchedBio?.length ?? 0}/100 حرف
            </p>
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Practice Areas */}
        <div className="space-y-3">
          <Label>مجالات الممارسة * (اختر واحد أو أكثر)</Label>
          {isLoadingSpecializations ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-primary ml-2" />
              <span className="text-muted-foreground">
                جاري تحميل التخصصات...
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <Badge
                  key={spec.id}
                  variant={
                    watchedPracticeAreas?.includes(spec.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer py-2 px-3"
                  onClick={() => togglePracticeArea(spec.id)}
                  title={spec.description}
                >
                  {spec.name}
                  {watchedPracticeAreas?.includes(spec.id) && (
                    <X className="w-3 h-3 mr-1" />
                  )}
                </Badge>
              ))}
            </div>
          )}
          {errors.practiceAreas && (
            <p className="text-sm text-destructive">
              {errors.practiceAreas.message}
            </p>
          )}
        </div>

        {/* Session Types */}
        <div className="space-y-3">
          <Label>نوع الجلسات * (اختر واحد أو أكثر)</Label>
          <div className="flex flex-wrap gap-4">
            {SESSION_TYPE_OPTIONS.map((type) => (
              <div
                key={type.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id={type.id}
                  className="cursor-pointer"
                  checked={watchedSessionTypes?.includes(type.id) ?? false}
                  onCheckedChange={() => toggleSessionType(type.id)}
                />
                <Label htmlFor={type.id} className="cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.sessionTypes && (
            <p className="text-sm text-destructive">
              {errors.sessionTypes.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin ml-2" />
            ) : null}
            التالي
          </Button>
        </div>
      </form>
      {/* Image Dialog */}
      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={(v) => {
          if (!v) setPreviewFile(null);
          setImageDialogOpen(v);
        }}
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
        confirmImage={confirmImage}
      />
    </div>
  );
};

// Image Dialog
interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewFile: File | null;
  setPreviewFile: (file: File | null) => void;
  confirmImage: () => void;
}

const ImageDialog = ({
  open,
  onOpenChange,
  previewFile,
  setPreviewFile,
  confirmImage,
}: ImageDialogProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>رفع صورة الملف الشخصي</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {previewFile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setPreviewFile(null)}
                >
                  تغيير الصورة
                </Button>
                <Button className="cursor-pointer" onClick={confirmImage}>
                  تأكيد
                </Button>
              </div>
            </div>
          ) : (
            <label className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">اضغط لرفع صورة</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BasicInfoStep;
