import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cropper from "react-easy-crop";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { getAvatarColor, getInitials } from "@/lib/avatarHelpers";
import { COUNTRIES, CITIES_BY_COUNTRY } from "@/data/onboarding";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/client-profile.schema";

export interface ProfileData {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  phoneNumber: string;
  bio: string;
  profileImage: File | string | null;
}

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: ProfileData;
  onSave: (data: ProfileData) => Promise<void> | void;
  isSaving?: boolean;
}

const ProfileEditModal = ({
  open,
  onOpenChange,
  currentData,
  onSave,
  isSaving = false,
}: ProfileEditModalProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const normalizePhoneInput = (phone: string) =>
    phone.replace(/^\+20\s*/, "").trim();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentData.firstName,
      lastName: currentData.lastName,
      country: currentData.country,
      city: currentData.city,
      phoneNumber: normalizePhoneInput(currentData.phoneNumber),
      bio: currentData.bio,
    },
  });

  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  useEffect(() => {
    if (!open) return;
    reset({
      firstName: currentData.firstName,
      lastName: currentData.lastName,
      country: currentData.country,
      city: currentData.city,
      phoneNumber: normalizePhoneInput(currentData.phoneNumber),
      bio: currentData.bio,
    });
    setImageSrc(null);
    setShowCropper(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  }, [
    open,
    currentData.firstName,
    currentData.lastName,
    currentData.country,
    currentData.city,
    currentData.phoneNumber,
    currentData.bio,
    reset,
  ]);

  const onCropComplete = useCallback(
    (
      _croppedArea: unknown,
      areaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(areaPixels);
    },
    [],
  );

  const createCroppedImageFile = async (): Promise<File | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          resolve(
            new File([blob], `client-profile-${Date.now()}.jpg`, {
              type: "image/jpeg",
            }),
          );
        }, "image/jpeg");
      };
    });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    let finalImage: File | string | null = currentData.profileImage;

    if (showCropper && imageSrc) {
      const croppedImageFile = await createCroppedImageFile();
      if (croppedImageFile) finalImage = croppedImageFile;
    }

    await onSave({
      firstName: values.firstName,
      lastName: values.lastName,
      country: values.country,
      city: values.city,
      phoneNumber: values.phoneNumber,
      bio: values.bio ?? "",
      profileImage: finalImage,
    });

    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="max-w-5xl max-h-screen overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="mt-3">تعديل الملف الشخصي</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label>الصورة الشخصية</Label>
          <div className="flex flex-col items-center gap-4">
            {showCropper && imageSrc ? (
              <div className="w-full">
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Label>تكبير / تصغير</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowCropper(false);
                    setImageSrc(null);
                    setCroppedAreaPixels(null);
                  }}
                  className="cursor-pointer mt-4 w-full"
                >
                  إلغاء الصورة
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {typeof currentData.profileImage === "string" &&
                  currentData.profileImage ? (
                  <img
                    src={currentData.profileImage}
                    className="w-32 h-32 rounded-full object-cover border-4 border-border"
                    alt="Profile"
                  />
                ) : (
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-border flex items-center justify-center text-lg font-bold ${getAvatarColor(
                      `${currentData.firstName} ${currentData.lastName}`,
                    )}`}
                  >
                    {getInitials(currentData.firstName, currentData.lastName)}
                  </div>
                )}
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة جديدة</span>
                  </div>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        <form
          id="profile-edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">الاسم الأول</Label>
              <Input
                id="profile-first-name"
                placeholder="أدخل الاسم الأول"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-last-name">اسم العائلة</Label>
              <Input
                id="profile-last-name"
                placeholder="أدخل اسم العائلة"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">رقم الهاتف</Label>
            <Input
              id="profile-phone"
              type="tel"
              inputMode="numeric"
              placeholder="رقم الهاتف"
              className="w-full"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الدولة</Label>
              <Select
                dir="rtl"
                value={selectedCountry}
                onValueChange={(value) => {
                  setValue("country", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("city", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="cursor-pointer">
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
              {errors.country && (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>المدينة</Label>
              <Select
                dir="rtl"
                value={selectedCity}
                onValueChange={(value) =>
                  setValue("city", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={!selectedCountry}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent align="end">
                  {(CITIES_BY_COUNTRY[selectedCountry] ?? []).map((city) => (
                    <SelectItem
                      key={city}
                      value={city}
                      className="cursor-pointer justify-end"
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-bio">نبذة مختصرة</Label>
            <Textarea
              id="profile-bio"
              placeholder="أخبرنا عن نفسك"
              rows={4}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </form>

        <DialogFooter className="sm:justify-start mt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            className="cursor-pointer"
            type="submit"
            form="profile-edit-form"
            disabled={isSaving}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
