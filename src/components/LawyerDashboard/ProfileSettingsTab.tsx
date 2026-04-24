import {
  Camera,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  User,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CITIES_BY_COUNTRY } from "@/data/onboarding";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OwnerSettings = {
  firstName: string;
  lastName: string;
  bio: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  profileImage: string;
  summary?: string;
  officePrice?: string;
  phonePrice?: string;
};

type EducationRecord = {
  id: string;
  degree: string;
  university: string;
  year: string;
};

type CertificateRecord = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

type ExperienceRecord = {
  id: string;
  title: string;
  company: string;
  startYear: string;
  endYear: string;
};

type LawyerProfileSettingsTabProps = {
  isEditingSettings: boolean;
  setIsEditingSettings: React.Dispatch<React.SetStateAction<boolean>>;
  ownerSettings: OwnerSettings;
  setOwnerSettings: React.Dispatch<React.SetStateAction<OwnerSettings>>;
  arabCountries: string[];
  educationRecords: EducationRecord[];
  certificateRecords: CertificateRecord[];
  experienceRecords: ExperienceRecord[];
  setIsEducationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCertificateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExperienceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const LawyerProfileSettingsTab = ({
  isEditingSettings,
  setIsEditingSettings,
  ownerSettings,
  setOwnerSettings,
  arabCountries,
  educationRecords,
  certificateRecords,
  experienceRecords,
  setIsEducationModalOpen,
  setIsCertificateModalOpen,
  setIsExperienceModalOpen,
  setIsImageModalOpen,
  handleImageFileSelect,
}: LawyerProfileSettingsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            إعدادات الملف الشخصي
          </h3>
          <Button
            variant={isEditingSettings ? "default" : "outline"}
            onClick={() => {
              if (isEditingSettings) toast.success("تم حفظ الإعدادات");
              setIsEditingSettings((p) => !p);
            }}
          >
            {isEditingSettings ? (
              <>
                <Save className="w-4 h-4 ml-1" /> حفظ
              </>
            ) : (
              "تعديل"
            )}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-muted/20 rounded-xl border border-dashed border-border/60 hover:border-border transition-colors">
          <div className="relative group shrink-0">
            <img
              src={ownerSettings.profileImage}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-sm"
            />
            {isEditingSettings && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform">
                <Camera className="w-4 h-4 text-primary-foreground" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
              </label>
            )}
          </div>
          <div className="text-center sm:text-right flex-1 pt-2">
            <h4 className="font-bold text-base mb-1">الصورة الشخصية</h4>
            <p className="text-xs text-muted-foreground mb-4">
              أضف صورة احترافية تظهر فيها ملامح الوجه بوضوح. الصور الاحترافية تزيد من ثقة العملاء بنسبة 70٪.
            </p>
            {isEditingSettings && (
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium border border-border bg-background rounded-lg px-4 py-2 hover:bg-muted transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                تغيير الصورة
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
              </label>
            )}
          </div>
        </div>

        {/* First Name & Last Name — always disabled */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">
              الاسم الأول
            </label>
            <Input
              disabled
              value={ownerSettings.firstName}
              placeholder="الاسم الأول"
              className="bg-muted/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">
              اسم العائلة
            </label>
            <Input
              disabled
              value={ownerSettings.lastName}
              placeholder="اسم العائلة"
              className="bg-muted/30"
            />
          </div>
        </div>

        {/* Email — always disabled */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
          </label>
          <Input
            disabled
            value={ownerSettings.email}
            placeholder="البريد الإلكتروني"
            className="bg-muted/30"
            dir="ltr"
          />
        </div>

        {/* Phone Number — single input */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> رقم الهاتف
          </label>
          <Input
            disabled={!isEditingSettings}
            value={ownerSettings.phoneNumber}
            onChange={(e) =>
              setOwnerSettings((p) => ({
                ...p,
                phoneNumber: e.target.value,
              }))
            }
            placeholder="رقم الهاتف مع مفتاح الدولة"
            dir="ltr"
          />
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> الدولة
            </label>
            <Select
              disabled={!isEditingSettings}
              value={ownerSettings.country}
              onValueChange={(v) =>
                setOwnerSettings((p) => ({ ...p, country: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدولة" />
              </SelectTrigger>
              <SelectContent>
                {arabCountries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> المدينة
            </label>
            <Select
              disabled={!isEditingSettings}
              value={ownerSettings.city}
              onValueChange={(v) =>
                setOwnerSettings((p) => ({ ...p, city: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {(CITIES_BY_COUNTRY[ownerSettings.country] || []).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            النبذة المهنية (Bio)
          </label>
          <Textarea
            disabled={!isEditingSettings}
            value={ownerSettings.bio}
            onChange={(e) =>
              setOwnerSettings((p) => ({
                ...p,
                bio: e.target.value,
              }))
            }
            rows={5}
            placeholder="نبذة مهنية..."
            className="resize-none"
          />
          {isEditingSettings && (
            <p className="text-xs text-muted-foreground text-left">
              {ownerSettings.bio.length} / 600 حرف
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            الملخص الاستعراضي (Summary)
          </label>
          <Textarea
            disabled={!isEditingSettings}
            value={ownerSettings.summary || ""}
            onChange={(e) =>
              setOwnerSettings((p) => ({
                ...p,
                summary: e.target.value,
              }))
            }
            rows={3}
            placeholder="ملخص عنك..."
            className="resize-none"
          />
          {isEditingSettings && (
            <p className="text-xs text-muted-foreground text-left">
              {(ownerSettings.summary || "").length} / 200 حرف
            </p>
          )}
        </div>

        {/* Prices Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> سعر الاستشارة المكتبية (ج.م)
            </label>
            <Input
              disabled={!isEditingSettings}
              value={ownerSettings.officePrice || ""}
              onChange={(e) =>
                setOwnerSettings((p) => ({
                  ...p,
                  officePrice: e.target.value,
                }))
              }
              placeholder="مثال: 500"
              type="number"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> سعر الاستشارة الهاتفية (ج.م)
            </label>
            <Input
              disabled={!isEditingSettings}
              value={ownerSettings.phonePrice || ""}
              onChange={(e) =>
                setOwnerSettings((p) => ({
                  ...p,
                  phonePrice: e.target.value,
                }))
              }
              placeholder="مثال: 300"
              type="number"
            />
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">المؤهلات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEducationModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {educationRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.degree}</p>
                <p className="text-xs text-muted-foreground">
                  {r.university} - {r.year}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">الشهادات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCertificateModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {certificateRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.issuer} - {r.year}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">الخبرات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExperienceModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {experienceRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.company} ({r.startYear} - {r.endYear})
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-secondary" /> تغيير كلمة المرور
          </h4>
          <div className="space-y-3 mb-3">
            <Input type="password" placeholder="كلمة المرور الحالية" />
            <Input type="password" placeholder="كلمة المرور الجديدة" />
            <Input
              className="mb-5"
              type="password"
              placeholder="تأكيد كلمة المرور"
            />
            <Button
              className="w-full"
              onClick={() => toast.success("تم تحديث كلمة المرور")}
            >
              تحديث كلمة المرور
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LawyerProfileSettingsTab;
