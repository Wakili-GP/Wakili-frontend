import { useState } from "react";
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
import { Camera, X, Upload, SettingsIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
interface BasicInfoData {
  fullName: string;
  email: string;
  profileImage: string | null;
  phoneCode: string;
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: string;
  practiceAreas: string[];
  sessionTypes: string[];
}

interface BasicInfoStepProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
  onNext: () => void;
  registrationData?: { name: string; email: string };
}
const practiceAreaOptions = [
  "القانون الجنائي",
  "قانون الأسرة",
  "القانون التجاري",
  "القانون المدني",
  "قانون العمل",
  "القانون الدولي",
  "قانون الشركات",
  "القانون العقاري",
  "قانون الملكية الفكرية",
  "القانون الإداري",
];
const sessionTypeOptions = [
  { id: "office", label: "استشارة مكتبية" },
  { id: "phone", label: "استشارة هاتفية" },
];
const countries = [
  "مصر",
  "السعودية",
  "الإمارات",
  "الكويت",
  "قطر",
  "البحرين",
  "عمان",
  "الأردن",
];
const citiesByCountry: Record<string, string[]> = {
  مصر: ["القاهرة", "الإسكندرية", "الجيزة", "المنصورة", "طنطا", "أسيوط"],
  السعودية: ["الرياض", "جدة", "مكة", "المدينة", "الدمام"],
  الإمارات: ["دبي", "أبوظبي", "الشارقة", "عجمان"],
  الكويت: ["مدينة الكويت", "حولي", "الفروانية"],
  قطر: ["الدوحة", "الوكرة", "الخور"],
  البحرين: ["المنامة", "المحرق", "الرفاع"],
  عمان: ["مسقط", "صلالة", "صحار"],
  الأردن: ["عمان", "إربد", "الزرقاء"],
};
const phoneCodes = [
  { code: "+20", country: "مصر" },
  { code: "+966", country: "السعودية" },
  { code: "+971", country: "الإمارات" },
  { code: "+965", country: "الكويت" },
  { code: "+974", country: "قطر" },
  { code: "+973", country: "البحرين" },
  { code: "+968", country: "عمان" },
  { code: "+962", country: "الأردن" },
];
const BasicInfoStep = ({
  data,
  onChange,
  onNext,
  registrationData,
}: BasicInfoStepProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) newErrors.fullName = "الاسم مطلوب";
    if (!data.profileImage) newErrors.profileImage = "صورة الملف الشخصي مطلوبة";
    if (!data.phoneNumber.trim()) newErrors.phoneNumber = "رقم الهاتف مطلوب";
    if (!data.country) newErrors.country = "الدولة مطلوبة";
    if (!data.city) newErrors.city = "المدينة مطلوبة";
    if (!data.bio.trim() || data.bio.length < 100)
      newErrors.bio = "الملخص المهني مطلوب (100 حرف على الأقل)";
    if (!data.yearsOfExperience)
      newErrors.yearsOfExperience = "سنوات الخبرة مطلوبة";
    if (data.practiceAreas.length === 0)
      newErrors.practiceAreas = "اختر مجال ممارسة واحد على الأقل";
    if (data.sessionTypes.length === 0)
      newErrors.sessionTypes = "اختر نوع جلسة واحد على الأقل";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  const confirmImage = () => {
    if (previewImage) {
      onChange({ ...data, profileImage: previewImage });
      setImageDialogOpen(false);
      setPreviewImage(null);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const toggleSessionType = (type: string) => {
    const newTypes = data.sessionTypes.includes(type)
      ? data.sessionTypes.filter((t) => t !== type)
      : [...data.sessionTypes, type];
    onChange({ ...data, sessionTypes: newTypes });
  };
  const togglePracticeArea = (area: string) => {
    const newAreas = data.practiceAreas.includes(area)
      ? data.practiceAreas.filter((t) => t !== area)
      : [...data.practiceAreas, area];
    onChange({ ...data, practiceAreas: newAreas });
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
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className={`w-28 h-28 rounded-full border-4 ${
              errors.profileImage ? "border-destructive" : "border-primary/20"
            } overflow-hidden bg-muted flex items-center justify-center cursor-pointer`}
            onClick={() => setImageDialogOpen(true)}
          >
            {data.profileImage ? (
              <img
                src={data.profileImage}
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
          <p className="text-sm text-destructive">{errors.profileImage}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم الكامل *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            placeholder="أدخل اسمك الكامل"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={data.email || registrationData?.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            لا يمكن تغيير البريد الإلكتروني
          </p>
        </div>
        {/* Phone */}
        <div className="space-y-2">
          <Label>رقم الهاتف *</Label>
          <div className="flex gap-2">
            <Select
              dir="rtl"
              value={data.phoneCode}
              onValueChange={(value) => onChange({ ...data, phoneCode: value })}
            >
              <SelectTrigger className="cursor-pointer w-36 text-right">
                <SelectValue placeholder="الكود" />
              </SelectTrigger>
              <SelectContent align="end" className="w-36">
                {phoneCodes.map((item) => (
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
            <Input
              value={data.phoneNumber}
              onChange={(e) =>
                onChange({ ...data, phoneNumber: e.target.value })
              }
              placeholder="رقم الهاتف"
              className={`flex-1 ${errors.phoneNumber ? "border-destructive" : ""}`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber}</p>
          )}
        </div>
        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">سنوات الخبرة *</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            max="60"
            value={data.yearsOfExperience}
            onChange={(e) =>
              onChange({ ...data, yearsOfExperience: e.target.value })
            }
            placeholder="عدد سنوات الخبرة"
            className={errors.yearsOfExperience ? "border-destructive" : ""}
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-destructive">
              {errors.yearsOfExperience}
            </p>
          )}
        </div>
        {/* Country */}
        <div className="space-y-2">
          <Label>الدولة *</Label>
          <Select
            dir="rtl"
            value={data.country}
            onValueChange={(value) =>
              onChange({ ...data, country: value, city: "" })
            }
          >
            <SelectTrigger
              className={`cursor-pointer ${errors.country ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent align="end">
              {countries.map((country) => (
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
            <p className="text-sm text-destructive">{errors.country}</p>
          )}
        </div>
        {/* City */}
        <div className="space-y-2">
          <Label>المدينة *</Label>
          <Select
            dir="rtl"
            value={data.city}
            onValueChange={(value) => onChange({ ...data, city: value })}
            disabled={!data.country}
          >
            <SelectTrigger className={errors.city ? "border-destructive" : ""}>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {(citiesByCountry[data.country] || []).map((city) => (
                <SelectItem
                  className="justify-end cursor-pointer"
                  key={city}
                  value={city}
                >
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>
      </div>
      {/* Bio */}
      <div className="space-y-3">
        <Label htmlFor="bio">الملخص المهني * (100 حرف على الأقل)</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
          placeholder="اكتب نبذة مختصرة عن خبراتك ومجالات تخصصك..."
          className={`min-h-[120px] ${errors.bio ? "border-destructive" : ""}`}
        />
        <div className="flex justify-between">
          <p
            className={`text-xs ${data.bio.length < 100 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {data.bio.length}/100 حرف
          </p>
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio}</p>
          )}
        </div>
      </div>
      {/* Practice Areas */}
      <div className="space-y-3">
        <Label>مجالات الممارسة * (اختر واحد أو أكثر)</Label>
        <div className="flex flex-wrap gap-2">
          {practiceAreaOptions.map((area) => (
            <Badge
              key={area}
              variant={
                data.practiceAreas.includes(area) ? "default" : "outline"
              }
              className="cursor-pointer py-2 px-3"
              onClick={() => togglePracticeArea(area)}
            >
              {area}
              {data.practiceAreas.includes(area) && (
                <X className="w-3 h-3 mr-1" />
              )}
            </Badge>
          ))}
        </div>
        {errors.practiceAreas && (
          <p className="text-sm text-destructive">{errors.practiceAreas}</p>
        )}
      </div>
      {/* Session Types */}
      <div className="space-y-3">
        <Label>نوع الجلسات * (اختر واحد أو أكثر)</Label>
        <div className="flex flex-wrap gap-4">
          {sessionTypeOptions.map((type) => (
            <div
              key={type.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                className="cursor-pointer"
                id={type.id}
                checked={data.sessionTypes.includes(type.id)}
                onCheckedChange={() => toggleSessionType(type.id)}
              />
              <Label htmlFor={type.id} className="cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.sessionTypes && (
          <p className="text-sm text-destructive">{errors.sessionTypes}</p>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} size="lg">
          التالي
        </Button>
      </div>
      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        confirmImage={confirmImage}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
};
interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  confirmImage: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageDialog = ({
  open,
  onOpenChange,
  previewImage,
  setPreviewImage,
  confirmImage,
  handleImageUpload,
}: ImageDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setPreviewImage(null); // reset on close
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>رفع صورة الملف الشخصي</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {previewImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setPreviewImage(null)}
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
                onChange={handleImageUpload}
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
