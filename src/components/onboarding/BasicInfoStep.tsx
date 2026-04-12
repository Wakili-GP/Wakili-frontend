import { useState, useEffect } from "react";
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
import { getAvatarColor, getInitials } from "@/lib/avatarHelpers";
import {
  SESSION_TYPE_OPTIONS,
  COUNTRIES,
  CITIES_BY_COUNTRY,
} from "@/data/onboarding";
import { toast } from "@/components/ui/sonner";
import { onboardingService } from "@/services/onboarding-services";
import { useMutation } from "@tanstack/react-query";

interface BasicInfoStepProps {
  onNext: (x: number) => void;
}

type BasicInfoFormInput = z.input<typeof basicInfoSchema>;

const BasicInfoStep = ({ onNext }: BasicInfoStepProps) => {
  // For fetching the firstName, lastName, and email at first
  const { user } = useAuth();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const mapPracticeAreasToIds = (
    areas?:
      | number[]
      | Array<{ id: number; name: string; description: string }>
      | null,
  ): number[] => {
    if (!areas?.length) return [];
    if (typeof areas[0] === "number") return areas as number[];
    return (areas as Array<{ id: number }>).map((area) => area.id);
  };

  const urlToFile = async (url: string, fileName = "profile-image") => {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1] || "jpg";
    return new File([blob], `${fileName}.${extension}`, { type: blob.type });
  };

  // Fetching Prev Information
  const { data: progressResponse, isSuccess } = useQuery({
    queryKey: ["onboarding-progress"],
    queryFn: () => onboardingService.getOnboardingProgress(),
    select: (response) => response.data?.data.basicInfo,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BasicInfoFormInput, unknown, BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      country: "",
      city: "",
      bio: "",
      yearsOfExperience: 0,
      practiceAreas: [],
      sessionTypes: [],
    },
  });

  useEffect(() => {
    if (!isSuccess) return;

    console.log(
      "Onboarding Progress Response BASIC INFO INSIDE SUCCESS:",
      progressResponse,
    );

    reset({
      profileImage: progressResponse?.profileImage || null,
      firstName: progressResponse?.firstName || user?.firstName || "",
      lastName: progressResponse?.lastName || user?.lastName || "",
      phoneNumber: progressResponse?.phoneNumber || "",
      bio: progressResponse?.bio || "",
      country: progressResponse?.country || "",
      city: progressResponse?.city || "",
      yearsOfExperience: progressResponse?.yearsOfExperience ?? 0,
      practiceAreas: mapPracticeAreasToIds(progressResponse?.practiceAreas),
      sessionTypes: progressResponse?.sessionTypes || [],
    });
  }, [isSuccess, progressResponse, reset, user?.firstName, user?.lastName]);

  // BasicInfoMutation
  const basicInfoMutation = useMutation({
    mutationFn: (data: LawyerBasicInfo) =>
      onboardingService.saveBasicInfo(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("تم حفظ المعلومات الأساسية");
        onNext(2);
      } else {
        toast.error("خطأ", {
          description: response.error || "فشل حفظ البيانات",
        });
      }
    },
    onError: () => toast.error("خطأ", { description: "فشل الاتصال بالخادم" }),
  });

  // Mutation Submission Handler
  const onSubmit = async (data: BasicInfoFormData) => {
    let profileImage = data.profileImage;

    if (typeof profileImage === "string" && profileImage) {
      try {
        profileImage = await urlToFile(profileImage);
      } catch {
        toast.error("خطأ", {
          description: "تعذر تجهيز صورة الملف الشخصي للإرسال",
        });
        return;
      }
    }

    basicInfoMutation.mutate({
      ...data,
      profileImage,
    } as LawyerBasicInfo);
  };

  // Fetching Specializations
  const { data: specializations = [], isLoading: isLoadingSpecializations } =
    useQuery<ApiResponse<Specialization[]>, Error, Specialization[]>({
      queryKey: ["specializations"],
      queryFn: () => SpecializationService.getSpecializations(),
      select: (response) => response.data ?? [],
    });

  const watchedBio = watch("bio"); // Watching bio for character count
  const watchedCountry = watch("country"); // Watching country to reset city when country changes
  const watchedPracticeAreas = watch("practiceAreas"); // Watching practice areas to toggle selection
  const watchedSessionTypes = watch("sessionTypes"); // Watching session types to toggle selection
  const watchedProfileImage = watch("profileImage");

  const confirmImage = () => {
    if (previewFile) {
      setValue("profileImage", previewFile, {
        shouldValidate: true,
        shouldDirty: true,
      });
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

  const toggleSessionType = (id: number) => {
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
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className={`w-28 h-28 rounded-full border-4 ${errors.profileImage ? "border-destructive" : "border-primary/20"} overflow-hidden bg-muted flex items-center justify-center cursor-pointer`}
              onClick={() => setImageDialogOpen(true)}
            >
              {watchedProfileImage ? (
                <img
                  src={
                    typeof watchedProfileImage === "string"
                      ? watchedProfileImage
                      : URL.createObjectURL(watchedProfileImage)
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-3xl font-bold ${getAvatarColor((watch("firstName") || "") + " " + (watch("lastName") || ""))}`}
                >
                  {getInitials(
                    watch("firstName") || "",
                    watch("lastName") || "",
                  ) || <Camera className="w-8 h-8 opacity-50" />}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setImageDialogOpen(true)}
              className="absolute bottom-0 left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          {errors.profileImage && (
            <p className="text-sm text-destructive">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>الاسم الأول</Label>
            <Input
              {...register("firstName")}
              placeholder="الاسم الأول"
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>الاسم الأخير</Label>
            <Input
              {...register("lastName")}
              placeholder="الاسم الأخير"
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
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
            <Input
              {...register("phoneNumber")}
              placeholder="رقم الهاتف"
              dir="rtl"
              className={`text-right ${
                errors.phoneNumber ? "border-destructive" : ""
              }`}
            />
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
                  key={field.value || "country-select"}
                  dir="rtl"
                  value={field.value || undefined}
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
                  key={watchedCountry || "city-select"}
                  dir="rtl"
                  value={field.value || undefined}
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
                  id={`session-type-${type.id}`}
                  className="cursor-pointer"
                  checked={watchedSessionTypes?.includes(type.id) ?? false}
                  onCheckedChange={() => toggleSessionType(type.id)}
                />
                <Label
                  htmlFor={`session-type-${type.id}`}
                  className="cursor-pointer"
                >
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

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={basicInfoMutation.isPending}
            className="cursor-pointer"
          >
            {basicInfoMutation.isPending && (
              <Loader className="w-4 h-4 animate-spin ml-2" />
            )}
            التالي
          </Button>
        </div>
      </form>

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
}: ImageDialogProps) => (
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
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreviewFile(f);
              }}
              className="hidden"
            />
          </label>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default BasicInfoStep;
