import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Settings,
  Clock,
  DollarSign,
  Phone,
  Building,
  Save,
  Camera,
} from "lucide-react";

interface ProfessionalSettingsTabProps {
  lawyerData: {
    bio: string;
    sessionPrice: number;
    sessionTypes: string[];
    contactPreferences: string[];
    availability: { day: string; slots: string[] }[];
    profileImage: string;
  };
  onUpdate: (data: any) => void;
}

const DAYS_OF_WEEK = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

const ProfessionalSettingsTab: React.FC<ProfessionalSettingsTabProps> = ({
  lawyerData,
  onUpdate,
}) => {
  const [bio, setBio] = useState(lawyerData.bio);
  const [sessionPrice, setSessionPrice] = useState(lawyerData.sessionPrice);
  const [sessionTypes, setSessionTypes] = useState<string[]>(
    lawyerData.sessionTypes,
  );
  const [contactPreferences, setContactPreferences] = useState<string[]>(
    lawyerData.contactPreferences,
  );
  const [availability, setAvailability] = useState(lawyerData.availability);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSessionType = (type: string) => {
    setSessionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleContactPreference = (pref: string) => {
    setContactPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  };

  const toggleDayAvailability = (day: string) => {
    setAvailability((prev) => {
      const exists = prev.find((a) => a.day === day);
      if (exists) {
        return prev.filter((a) => a.day !== day);
      }
      return [...prev, { day, slots: [] }];
    });
  };

  const toggleTimeSlot = (day: string, slot: string) => {
    setAvailability((prev) =>
      prev.map((a) => {
        if (a.day === day) {
          const slots = a.slots.includes(slot)
            ? a.slots.filter((s) => s !== slot)
            : [...a.slots, slot];
          return { ...a, slots };
        }
        return a;
      }),
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onUpdate({
      bio,
      sessionPrice,
      sessionTypes,
      contactPreferences,
      availability,
    });

    // toast.success("تم حفظ الإعدادات بنجاح");
    setIsLoading(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <span>الإعدادات المهنية</span>
      </h2>

      <div className="space-y-8">
        {/* Profile Image */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">صورة الملف الشخصي</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={lawyerData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>اضغط على الأيقونة لتغيير الصورة</p>
              <p>يُفضل صورة بحجم 200×200 بكسل</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-lg font-semibold">
            نبذة عني
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="اكتب نبذة مختصرة عن خبراتك وتخصصاتك..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            {bio.length} / 500 حرف
          </p>
        </div>

        {/* Session Price */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            سعر الجلسة (بالساعة)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={sessionPrice}
              onChange={(e) => setSessionPrice(Number(e.target.value))}
              className="w-32"
              min={0}
            />
            <span className="text-muted-foreground">جنيه مصري</span>
          </div>
        </div>

        {/* Session Types */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Phone className="w-5 h-5" />
            نوع الجلسات
          </Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={sessionTypes.includes("phone")}
                onCheckedChange={() => toggleSessionType("phone")}
              />
              <span>استشارة هاتفية</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={sessionTypes.includes("office")}
                onCheckedChange={() => toggleSessionType("office")}
              />
              <span>استشارة مكتبية</span>
            </label>
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Building className="w-5 h-5" />
            طرق التواصل المفضلة
          </Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={contactPreferences.includes("whatsapp")}
                onCheckedChange={() => toggleContactPreference("whatsapp")}
              />
              <span>واتساب</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={contactPreferences.includes("phone")}
                onCheckedChange={() => toggleContactPreference("phone")}
              />
              <span>هاتف</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={contactPreferences.includes("email")}
                onCheckedChange={() => toggleContactPreference("email")}
              />
              <span>بريد إلكتروني</span>
            </label>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            أوقات التوفر
          </Label>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayAvailability = availability.find((a) => a.day === day);
              const isActive = !!dayAvailability;

              return (
                <div key={day} className="border rounded-lg p-4">
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <Checkbox
                      checked={isActive}
                      onCheckedChange={() => toggleDayAvailability(day)}
                    />
                    <span className="font-medium">{day}</span>
                  </label>

                  {isActive && (
                    <div className="flex flex-wrap gap-2 mr-6">
                      {TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={
                            dayAvailability.slots.includes(slot)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTimeSlot(day, slot)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full cursor-pointer"
        >
          <Save className="w-4 h-4 ml-2" />
          {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </Card>
  );
};

export default ProfessionalSettingsTab;
